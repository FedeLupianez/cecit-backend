import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CecitAdminsEntity } from './cecit-admins.entity';
import { Repository } from 'typeorm';
import { CecitAdminsCreateDTO, CecitAdminsDTO, CecitAdminsMapper } from './cecit-admins.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class CecitAdminsService {
    constructor(
        @InjectRepository(CecitAdminsEntity)
        private readonly cecitAdminsRepository: Repository<CecitAdminsEntity>
    ) { };

    async create(admin: CecitAdminsCreateDTO): Promise<CecitAdminsEntity> {
        const newAdmin = await this.cecitAdminsRepository.save(admin);
        if (!newAdmin)
            throw new InternalServerErrorException('Error creating cecit admin');
        return newAdmin;
    }

    async get_all(): Promise<CecitAdminsDTO[]> {
        const admins = await this.cecitAdminsRepository.find();
        if (!admins)
            throw new InternalServerErrorException('Admins is empty');
        const admins_mapped = admins.map((a) => CecitAdminsMapper.toDTO(a));
        return admins_mapped;
    }

    async get_by_email(email: string): Promise<CecitAdminsEntity> {
        if (!email || !isEmail(email))
            throw new BadRequestException('Email is required');
        const admin = await this.cecitAdminsRepository.findOneBy({
            email: email
        })
        if (!admin)
            throw new NotFoundException('Admin not exists');
        return admin;
    }

    async get_by_id(id_admin: string) {
        if (!id_admin)
            throw new BadRequestException('Id is required');
        const admin = await this.cecitAdminsRepository.findOneBy({ id_c_admin: id_admin });
        if (!admin)
            throw new NotFoundException('Admin not found');
        return admin;
    }
}
