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
} from './vouchers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VouchersEntity, VoucherStatus } from './vouchers.entity';
import { LessThan, Repository } from 'typeorm';
import { BenefitsEntity } from '../benefits/benefits.entity';
import { DbService } from '../../common/database/db.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class VouchersService {
    private readonly logger = new Logger(VouchersService.name);
    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        @InjectRepository(BenefitsEntity)
        private readonly benefitsRepository: Repository<BenefitsEntity>,
        private readonly dbService: DbService,
        private readonly pdfService: PdfService,
    ) { }

    async get_all(): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.find();
        if (!vouchers) throw new InternalServerErrorException('Vouchers is empty');

        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async get_by_user(id_user: string): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_user,
        });
        if (!vouchers)
            throw new NotFoundException('Vouchers not found');
        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async get_by_benefit(id_benefit: string): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_benefit,
        });
        if (!vouchers)
            throw new NotFoundException('Vouchers not found');
        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async get_by_token(token: string): Promise<VouchersDTO> {
        const voucher = await this.vouchersRepository.findOneBy({
            token,
        });
        if (!voucher)
            throw new NotFoundException('Voucher not found');
        return VouchersMapper.toDTO(voucher);
    }

    async get_by_status(status: VoucherStatus): Promise<VouchersDTO[] | null> {
        const vouchers = await this.vouchersRepository.findBy({
            status,
        });
        if (!vouchers)
            throw new NotFoundException('Vouchers not found');
        const vouchersList = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchersList;
    }

    async create(voucher: VouchersCreateDTO) {
        this.logger.log(`Creating voucher for benefit ${voucher.id_benefit}`);
        const benefit = await this.benefitsRepository.findOneBy({
            id_benefit: voucher.id_benefit,
        });

        if (!benefit)
            throw new NotFoundException('Benefit not found');

        const result = await this.benefitsRepository.increment(
            { id_benefit: voucher.id_benefit, coupons: LessThan(benefit.max_coupons) },
            'coupons',
            1
        );

        if (result.affected === 0)
            throw new ConflictException('Max coupons reached');

        const newVoucher = this.vouchersRepository.create({
            id_benefit: benefit.id_benefit,
            id_user: voucher.id_user
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
        const exists = await this.vouchersRepository.exists({
            where: {
                token: token
            }
        });
        if (!exists)
            throw new BadRequestException('Voucher does not exists');
        const html: string = `
            <div style='font-size:38px;font-family:'Segoe UI';width:100%;text-align:center;align-items:center;justify-content:center;'>
                <p>${token}</p>
            </div>
        `;
        return await this.pdfService.generatePDF(html);
    }
}
