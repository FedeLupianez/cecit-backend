/*
*  servicios para get_all(), get_by_user() y get_by_benefit()
* */

import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { VoucherResponseDTO } from "./voucher.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { VoucherEntity } from "./voucher.entity";
import { Repository } from "typeorm";

@Injectable()
export class VoucherService {
    constructor(
        @InjectRepository(VoucherEntity)
        private readonly voucherRepository: Repository<VoucherEntity>
    ) { };

    async get_all(): Promise<VoucherResponseDTO[]> {
        const vouchers = await this.voucherRepository.find();
        if (!vouchers)
            throw new InternalServerErrorException("Vouchers is empty");
        return vouchers;
    }

    async get_by_user(id_user: number): Promise<VoucherResponseDTO[] | null> {
        const vouchers = await this.voucherRepository.findBy({
            id_user
        })
        if (!vouchers)
            throw new NotFoundException(`Vouchers for user ${id_user} not found`);
        return vouchers;
    }

    async get_by_benefit(id_benefit: number): Promise<VoucherResponseDTO[] | null> {
        const vouchers = await this.voucherRepository.findBy({
            id_benefit
        })
        if (!vouchers)
            throw new NotFoundException(`Vouchers for benefit ${id_benefit} not found`);
        return vouchers;
    }

    async get_by_token(token: string): Promise<VoucherResponseDTO | null> {
        const voucher = await this.voucherRepository.findOneBy({
            token
        })
        if (!voucher)
            throw new NotFoundException(`Voucher with token ${token} not found`);
        return voucher;
    }

    async get_by_status(status: Enumerator): Promise<VoucherResponseDTO[] | null> {
        const vouchers = await this.voucherRepository.findBy({
            status
        })
        if (!vouchers)
            throw new NotFoundException(`Vouchers with status ${status} not found`);
        return vouchers;
    }
}