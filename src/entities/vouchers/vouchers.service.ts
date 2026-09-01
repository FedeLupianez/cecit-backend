/*
 *  servicios para get_all(), get_by_user() y get_by_benefit()
 * */

import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
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
import { Repository } from 'typeorm';
import { BenefitsService } from '../benefits/benefits.service';
import { DbService } from '../../common/database/db.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class VouchersService {
    private readonly logger = new Logger(VouchersService.name);
    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        private readonly benefitsService: BenefitsService,
        private readonly dbService: DbService,
        private readonly pdfService: PdfService,
    ) { }

    async get_all(): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.find();
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

    async get_by_user(id_user: string): Promise<VoucherReturn[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_user,
        });
        if (!vouchers) throw new NotFoundException('Vouchers not found');
        const vouchersList = await Promise.all(vouchers.map((v) => this.mapVoucher(v)));
        return vouchersList;
    }

    async get_by_benefit(id_benefit: string): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_benefit,
        });
        if (!vouchers) throw new NotFoundException('Vouchers not found');
        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async get_by_token(token: string): Promise<VoucherPartnerView> {
        if (!token)
            throw new BadRequestException('Token is empty');
        const voucher = await this.vouchersRepository.findOne({
            where: {
                token: token
            },
            relations: [
                'benefit',
                'benefit.partner',
                'benefit.partner.directions',
                'user'
            ]
        });
        if (!voucher)
            throw new NotFoundException('Voucher not found');
        const mappedVoucher: VoucherReturn = await this.mapVoucher(voucher);
        return {
            token: voucher.token,
            title: voucher.benefit.title,
            image: voucher.benefit.image,
            partner: voucher.benefit.partner.name,
            endDate: voucher.limit_date,
            directions: (voucher.benefit.partner.directions ?? []).map((d) => d.direction),
            logo: voucher.benefit.partner.logo,
            user_name: `${voucher.user.name} ${voucher.user.lastname}`,
            user_dni: voucher.user.dni,
            methods: mappedVoucher.methods,
            status: voucher.status
        }
    }

    async redeem_voucher(token: string): Promise<boolean> {
        const voucher = await this.vouchersRepository.findOneBy({ token: token });
        if (!voucher)
            throw new BadRequestException('Invalid Token');
        if (voucher.status == VoucherStatus.EXPIRED || voucher.status == VoucherStatus.DELIVERED || voucher.status == VoucherStatus.REJECTED)
            throw new BadRequestException('Invalid Voucher to redeem');
        voucher.status = VoucherStatus.DELIVERED;
        voucher.delivery_date = new Date();
        await this.vouchersRepository.save(voucher);
        this.logger.debug(`Voucher ${token} redeemed`);
        return true;
    }

    async reject_voucher(token: string): Promise<boolean> {
        const voucher = await this.vouchersRepository.findOneBy({ token: token });
        if (!voucher)
            throw new BadRequestException('Invalid Token');
        if (voucher.status == VoucherStatus.EXPIRED || voucher.status == VoucherStatus.DELIVERED)
            throw new BadRequestException('Invalid Voucher to reject');
        voucher.status = VoucherStatus.REJECTED;
        await this.vouchersRepository.save(voucher);
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
                id_user: vouchers.id_account,
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
        const benefit = await this.benefitsService.findOne(voucher.id_benefit);

        if (!benefit) throw new NotFoundException('Benefit not found');

        const incremented = await this.benefitsService.incrementCoupons(
            voucher.id_benefit,
            benefit.max_coupons,
        );

        if (!incremented) throw new ConflictException('Max coupons reached');

        const newVoucher = this.vouchersRepository.create({
            id_benefit: benefit.id_benefit,
            id_user: voucher.id_user,
        });

        newVoucher.token = await this.dbService.getNewToken();

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
            relations: { user: true, benefit: { partner: { directions: true } } },
        });
        if (!voucher) throw new BadRequestException('Voucher does not exists');

        return await this.pdfService.generateInvoicePDF({
            number: voucher.token,
            issueDate: voucher.application_date,
            deliveryDate: voucher.delivery_date,
            status: voucher.status,
            customer: {
                id: voucher.user.id_user,
                name: voucher.user.name,
                lastname: voucher.user.lastname,
                dni: voucher.user.dni,
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
}
