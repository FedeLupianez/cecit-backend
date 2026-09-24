
import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    VouchersDTO,
    VouchersCreateDTO,
    VouchersDeleteDTO,
    VouchersMapper,
    VoucherBenefitUser,
    ReturnCouponsUser,
    VoucherReturn,
    VoucherPartnerView,
} from './vouchers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VouchersEntity, VoucherStatus } from './vouchers.entity';
import { DataSource, LessThan, Not, Repository } from 'typeorm';
import { BenefitsService } from '../benefits/benefits.service';
import { PdfService } from 'src/pdf/pdf.service';
import { generateUniqueToken } from 'src/common/utils/id-generator';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';
import { Cron } from '@nestjs/schedule';
import { BenefitsEntity } from '../benefits/benefits.entity';

@Injectable()
export class VouchersService {
    private readonly logger = new Logger(VouchersService.name);
    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        private readonly benefitsService: BenefitsService,
        private readonly pdfService: PdfService,
        private readonly partnersAdminsService: PartnersAdminsService,
        private readonly dataSource: DataSource
    ) { }

    async get_all(): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.find({
            order: { application_date: 'DESC' }
        });
        if (!vouchers) throw new InternalServerErrorException('Vouchers is empty');

        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async mapVoucher(voucher: VouchersEntity): Promise<VoucherReturn> {
        const relatedBenefit = await this.benefitsService.get_benefit(voucher.id_benefit);
        if (!relatedBenefit)
            throw new BadRequestException('Invalid Voucher');
        return {
            title: relatedBenefit.title,
            image: relatedBenefit.image,
            partner: relatedBenefit.partner,
            endDate: relatedBenefit.end_date,
            directions: relatedBenefit.directions,
            logo: relatedBenefit.logo,
            methods: relatedBenefit.payment_methods,
            token: voucher.token,
            status: voucher.status
        }
    }

    async get_by_account(id_account: string): Promise<VoucherReturn[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_account,
        });
        if (!vouchers || vouchers.length === 0) return [];
        const benefitsMap = await this.benefitsService.getMappedByIds(
            vouchers.map((v) => v.id_benefit),
        );
        return vouchers
            .filter((v) => benefitsMap.has(v.id_benefit))
            .map((v) => {
                const b = benefitsMap.get(v.id_benefit)!;
                return {
                    title: b.title,
                    image: b.image,
                    partner: b.partner,
                    endDate: b.end_date,
                    directions: b.directions,
                    logo: b.logo,
                    methods: b.payment_methods,
                    token: v.token,
                    status: v.status,
                };
            });
    }

    /** @deprecated use get_by_account */
    async get_by_user(id_account: string): Promise<VoucherReturn[]> {
        return this.get_by_account(id_account);
    }

    async get_by_benefit(id_benefit: string): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_benefit,
        });
        if (!vouchers) throw new NotFoundException('Vouchers not found');
        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async get_by_token(token: string, id_admin: string): Promise<VoucherPartnerView> {
        if (!token)
            throw new BadRequestException('Token is empty');
        if (!id_admin)
            throw new UnauthorizedException('User is not logged');
        const voucher = await this.vouchersRepository.findOne({
            where: {
                token: token
            },
            relations: [
                'benefit',
                'benefit.partner',
                'benefit.partner.directions',
                'account',
                'account.user'
            ]
        });
        if (!voucher)
            throw new NotFoundException('Voucher not found');
        try {
            await this.partnersAdminsService.verify_admin(id_admin, voucher.benefit.id_partner);
        } catch {
            throw new ConflictException('Voucher belongs to other business');
        }

        const methods = await this.benefitsService.getPaymentMethodNames(
            voucher.benefit.id_benefit,
        );
        return {
            token: voucher.token,
            title: voucher.benefit.title,
            image: voucher.benefit.image,
            partner: voucher.benefit.partner.name,
            endDate: voucher.limit_date,
            directions: (voucher.benefit.partner.directions ?? []).map((d) => d.direction),
            logo: voucher.benefit.partner.logo,
            user_name: `${voucher.account.user.name} ${voucher.account.user.lastname}`,
            user_dni: voucher.account.user.dni,
            methods,
            status: voucher.status
        }
    }

    async redeem_voucher(token: string, id_admin: string): Promise<boolean> {
        const voucher = await this.vouchersRepository.findOne({
            where: {
                token: token
            },
            relations: ['benefit', 'benefit.partner']
        });
        if (!voucher)
            throw new BadRequestException('Invalid Token');
        if (voucher.status == VoucherStatus.EXPIRED || voucher.status == VoucherStatus.DELIVERED || voucher.status == VoucherStatus.REJECTED)
            throw new BadRequestException('Invalid Voucher to redeem');
        await this.partnersAdminsService.verify_admin(id_admin, voucher.benefit.id_partner);
        voucher.status = VoucherStatus.DELIVERED;
        voucher.delivery_date = new Date();
        await this.vouchersRepository.save(voucher);
        this.logger.debug(`Voucher ${token} redeemed`);
        return true;
    }

    async reject_voucher(token: string, id_admin: string): Promise<boolean> {
        const voucher = await this.vouchersRepository.findOne({
            where: { token: token }, relations: [
                'benefit',
                'benefit.partner'
            ]
        });
        if (!voucher)
            throw new BadRequestException('Invalid Token');
        if (voucher.status == VoucherStatus.EXPIRED || voucher.status == VoucherStatus.DELIVERED)
            throw new BadRequestException('Invalid Voucher to reject');
        await this.partnersAdminsService.verify_admin(id_admin, voucher.benefit.id_partner);

        voucher.status = VoucherStatus.REJECTED;
        await this.vouchersRepository.save(voucher);
        await this.benefitsService.decrementCoupons(voucher.id_benefit);
        this.logger.debug(`Voucher ${token} rejected`);
        return true;
    }

    async get_by_status(status: VoucherStatus): Promise<VouchersDTO[] | null> {
        const vouchers = await this.vouchersRepository.findBy({
            status,
        });
        if (!vouchers) throw new NotFoundException('Vouchers not found');
        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async get_by_user_benefit(vouchers: VoucherBenefitUser): Promise<ReturnCouponsUser> {
        const total = await this.vouchersRepository.count({
            where: {
                id_benefit: vouchers.id_benefit,
                id_account: vouchers.id_account,
            },
        })
        this.logger.debug(`Result of ${vouchers.id_benefit} | ${vouchers.id_account} = ${total}`)
        return {
            id_account: vouchers.id_account,
            coupons: total
        }
    }

    async create(voucher: VouchersCreateDTO) {
        this.logger.log(`Creating voucher for benefit ${voucher.id_benefit}`);
        const benefit = await this.benefitsService.findOneActive({ where: { id_benefit: voucher.id_benefit } });

        if (!benefit) throw new NotFoundException('Benefit not found');

        const incremented = await this.benefitsService.incrementCoupons(
            voucher.id_benefit,
            benefit.max_coupons,
        );

        if (!incremented) throw new ConflictException('Max coupons reached');

        const newVoucher = this.vouchersRepository.create({
            id_benefit: benefit.id_benefit,
            id_account: voucher.id_account,
        });

        newVoucher.token = await generateUniqueToken(this.vouchersRepository, 'token');

        return await this.vouchersRepository.save(newVoucher);
    }

    async delete(voucher: VouchersDeleteDTO): Promise<boolean> {
        const result = await this.vouchersRepository.delete({
            token: voucher.token,
        });
        if (!result)
            throw new NotFoundException(
                'El voucher que se quiere eliminar no fue encontrado',
            );
        return true;
    }

    async gen_file(token: string) {
        this.logger.debug(`Generating PDF for voucher: ${token}`);
        if (!token) throw new BadRequestException('Token does not exists');
        const voucher = await this.vouchersRepository.findOne({
            where: { token },
            relations: { account: { user: true } as any, benefit: { partner: { directions: true } } },
        });
        if (!voucher) throw new BadRequestException('Voucher does not exists');

        return await this.pdfService.generateInvoicePDF({
            number: voucher.token,
            issueDate: voucher.application_date,
            deliveryDate: voucher.delivery_date,
            status: voucher.status,
            customer: {
                id: voucher.account.id_account,
                name: voucher.account.user.name,
                lastname: voucher.account.user.lastname,
                dni: voucher.account.user.dni,
            },
            provider: {
                name: voucher.benefit.partner.name,
                logo: voucher.benefit.partner.logo,
                address: (voucher.benefit.partner.directions ?? [])
                    .map((d) => d.direction)
                    .join(', '),
            },
            item: {
                title: voucher.benefit.title,
                description: voucher.benefit.description,
                image: voucher.benefit.image,
                startDate: voucher.benefit.start_date,
                endDate: voucher.benefit.end_date,
            },
        });
    }

    @Cron('0 0 * * *')
    async update_expiration_status() {
        const today = new Date();
        await this.dataSource.transaction(async (manager) => {
            const vouchers = await this.vouchersRepository.find({
                where: {
                    limit_date: LessThan(today),
                    status: Not(VoucherStatus.EXPIRED)
                }
            });

            for (const voucher of vouchers) {
                await manager.update(
                    VouchersEntity,
                    { token: voucher.token },
                    { status: VoucherStatus.EXPIRED }
                )

                await manager.decrement(
                    BenefitsEntity,
                    { id_benefit: voucher.id_benefit },
                    'coupons',
                    1
                );
            }
        })
    }
}
