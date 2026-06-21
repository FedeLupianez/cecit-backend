import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CecitAdminsEntity } from './cecit-admins.entity';
import { Repository } from 'typeorm';
import { CecitAdminsDTO, CecitAdminsMapper } from './cecit-admins.dto';

@Injectable()
export class CecitAdminsService {
    constructor(
        @InjectRepository(CecitAdminsEntity)
        private readonly cecitAdminsRepository: Repository<CecitAdminsEntity>
    ) { };

    async get_all(): Promise<CecitAdminsDTO[]> {
        const admins = await this.cecitAdminsRepository.find();
        if (!admins)
            throw new InternalServerErrorException('Admins is empty');
        const admins_mapped = admins.map((a) => CecitAdminsMapper.toDTO(a));
        return admins_mapped;
    }

    async get_by_email(email: string): Promise<CecitAdminsEntity> {
        if (!email)
            throw new BadRequestException('Email is required');
        const admin = await this.cecitAdminsRepository.findOneBy({
            email: email
        })
        if (!admin)
            throw new NotFoundException('Admin not exists');
        return admin;
    }

}
