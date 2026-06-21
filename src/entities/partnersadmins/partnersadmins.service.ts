import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { Repository } from 'typeorm';
import { type PartnersAdminsDTO, type PartnersAdminsCreateDTO, PartnersAdminsMapper } from './partnersadmins.dto';
import { PartnersService } from '../partners/partners.service';
import { DbService } from 'src/common/database/db.service';

@Injectable()
export class PartnersAdminsService {
    constructor(
        @InjectRepository(PartnersAdminsEntity) private readonly adminsRepo: Repository<PartnersAdminsEntity>,
        @Inject(forwardRef(() => PartnersService)) private readonly partnersService: PartnersService,
        private readonly db_service: DbService
    ) { }

    async create(admin: PartnersAdminsCreateDTO): Promise<PartnersAdminsDTO> {
        const partner = await this.partnersService.get_by_name(admin.partner_name);
        const new_id = await this.db_service.get_new_id('PartnersAdmins', 'id_p_admin');
        const newAdmin = this.adminsRepo.create({
            id_p_admin: new_id,
            id_partner: partner.id_partner,
            email: admin.email,
            password: admin.password,
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
