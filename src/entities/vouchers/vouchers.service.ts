/*
 *  servicios para get_all(), get_by_user() y get_by_benefit()
 * */

import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
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
import { Repository } from 'typeorm';
import { BenefitsEntity } from '../benefits/benefits.entity';
import { DbService } from '../../common/database/db.service';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class VouchersService {
    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>,
        @InjectRepository(BenefitsEntity)
        private readonly benefitsRepository: Repository<BenefitsEntity>,
        private readonly db_service: DbService,
        private readonly pdfService: PdfService,
    ) { }

    async get_all(): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.find();
        if (!vouchers) throw new InternalServerErrorException('Vouchers is empty');

        const vouchers_list = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchers_list;
    }

    async get_by_user(id_user: string): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_user,
        });
        if (!vouchers)
            throw new NotFoundException(`Vouchers for user ${id_user} not found`);
        const vouchers_list = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchers_list;
    }

    async get_by_benefit(id_benefit: string): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.findBy({
            id_benefit,
        });
        if (!vouchers)
            throw new NotFoundException(
                `Vouchers for benefit ${id_benefit} not found`,
            );
        const vouchers_list = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchers_list;
    }

    async get_by_token(token: string): Promise<VouchersDTO> {
        const voucher = await this.vouchersRepository.findOneBy({
            token,
        });
        if (!voucher)
            throw new NotFoundException(`Voucher with token ${token} not found`);
        return VouchersMapper.toDTO(voucher);
    }

    async get_by_status(status: VoucherStatus): Promise<VouchersDTO[] | null> {
        const vouchers = await this.vouchersRepository.findBy({
            status,
        });
        if (!vouchers)
            throw new NotFoundException(`Vouchers with status ${status} not found`);
        const vouchers_list = vouchers.map((v) => VouchersMapper.toDTO(v));
        return vouchers_list;
    }

    async create(voucher: VouchersCreateDTO) {
        const benefit = await this.benefitsRepository.findOneBy({
            id_benefit: voucher.id_benefit,
        });

        if (!benefit)
            throw new NotFoundException(
                `Benefit with id ${voucher.id_benefit} not found`,
            );

        if (benefit.coupons >= benefit.max_cupouns)
            throw new ConflictException(
                `Benefit ${benefit.id_benefit} max cupouns reached`,
            );

        const new_voucher = this.vouchersRepository.create(voucher);

        new_voucher.token = await this.db_service.get_new_token();

        return await this.vouchersRepository.save(new_voucher);
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
        if (!token) throw new BadRequestException('Token does not exists');
        const exists = await this.vouchersRepository.exists({
            where: {
                token: token
            }
        });
        if (!exists)
            throw new BadRequestException('Voucher does not exists');
        const html: string = `
            <div style='font-size:38px;font-family:monospace;width:100%;text-align:center;align-items:center;justify-content:center;'>
                <p>${token}</p>
            </div>
        `;
        return await this.pdfService.generatePDF(html);
    }
}
