import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { Repository } from 'typeorm';
import { type PartnersAdminsDTO, type PartnersAdminsCreateDTO, PartnersAdminsMapper } from './partnersadmins.dto';
import { PartnersService } from '../partners/partners.service';
import { hash } from 'argon2';

@Injectable()
export class PartnersAdminsService {
    constructor(
        @InjectRepository(PartnersAdminsEntity) private readonly adminsRepo: Repository<PartnersAdminsEntity>,
        @Inject(forwardRef(() => PartnersService)) private readonly partnersService: PartnersService
    ) { }

    async create(admin: PartnersAdminsCreateDTO): Promise<PartnersAdminsDTO> {
        const partner = await this.partnersService.get_by_name(admin.partner);
        const hashed = await hash(admin.password);
        const newAdmin = this.adminsRepo.create({
            id_partner: partner.id_partner,
            email: admin.email,
            password: hashed,
        })

        const stored = await this.adminsRepo.save(newAdmin);
        if (!stored)
            throw new InternalServerErrorException('Error creating new Admin');
        return PartnersAdminsMapper.toDTO(stored);
    }

    async get_by_id(id_admin: string): Promise<PartnersAdminsDTO> {
        if (!id_admin)
            throw new BadRequestException('id admin is required');
        const admin = await this.adminsRepo.findOneBy({ id_p_admin: id_admin });
        if (!admin)
            throw new NotFoundException(`Admin with id ${id_admin} not exists`);
        return PartnersAdminsMapper.toDTO(admin);
    }
}
