/*
*  servicios para get_all(), get_by_user() y get_by_benefit()
* */

import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { VouchersDTO } from "./vouchers.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { VouchersEntity } from "./vouchers.entity";
import { Repository } from "typeorm";

@Injectable()
export class VouchersService {
    constructor(
        @InjectRepository(VouchersEntity)
        private readonly vouchersRepository: Repository<VouchersEntity>
    ) { };

    async get_all(): Promise<VouchersDTO[]> {
        const vouchers = await this.vouchersRepository.find();
        if (!vouchers)
            throw new InternalServerErrorException("Vouchers is empty");
        return vouchers;
    }

    async get_by_user(id_user: number): Promise<VouchersDTO[] | null> {
        const vouchers = await this.vouchersRepository.findBy({
            id_user
        })
        if (!vouchers)
            throw new NotFoundException(`Vouchers for user ${id_user} not found`);
        return vouchers;
    }

    async get_by_benefit(id_benefit: number): Promise<VouchersDTO[] | null> {
        const vouchers = await this.vouchersRepository.findBy({
            id_benefit
        })
        if (!vouchers)
            throw new NotFoundException(`Vouchers for benefit ${id_benefit} not found`);
        return vouchers;
    }

    async get_by_token(token: string): Promise<VouchersDTO | null> {
        const voucher = await this.vouchersRepository.findOneBy({
            token
        })
        if (!voucher)
            throw new NotFoundException(`Voucher with token ${token} not found`);
        return voucher;
    }

    async get_by_status(status: Enumerator): Promise<VouchersDTO[] | null> {
        const vouchers = await this.vouchersRepository.findBy({
            status
        })
        if (!vouchers)
            throw new NotFoundException(`Vouchers with status ${status} not found`);
        return vouchers;
    }
}
