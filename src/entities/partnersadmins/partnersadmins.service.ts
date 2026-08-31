import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { Repository } from 'typeorm';
import { type PartnersAdminsCreateDTO } from './partnersadmins.dto';
import { PartnersService } from '../partners/partners.service';
import { PartnersEntity } from '../partners/partners.entity';
import { DbService } from 'src/common/database/db.service';

@Injectable()
export class PartnersAdminsService {
    constructor(
        @InjectRepository(PartnersAdminsEntity) private readonly adminsRepo: Repository<PartnersAdminsEntity>,
        @Inject(forwardRef(() => PartnersService)) private readonly partnersService: PartnersService,
        private readonly dbService: DbService
    ) { }

    async create(admin: PartnersAdminsCreateDTO): Promise<PartnersAdminsEntity> {
        const partner = await this.partnersService.get_by_name(admin.partner_name);
        const newId = await this.dbService.getNewId('Partners_Admins', 'id_user');
        const newAdmin = this.adminsRepo.create({
            id_user: newId,
            id_partner: partner.id_partner,
        })

        const stored = await this.adminsRepo.save(newAdmin);
        if (!stored)
            throw new InternalServerErrorException('Error creating new Admin');
        return stored;
    }

    async get_by_id(id_admin: string): Promise<PartnersAdminsEntity> {
        if (!id_admin)
            throw new BadRequestException('id admin is required');
        const admin = await this.adminsRepo.findOneBy({ id_user: id_admin });
        if (!admin)
            throw new NotFoundException('Admin does not exists');
        return admin;
    }

    async get_partner_for_admin(id_admin: string): Promise<PartnersEntity> {
        if (!id_admin) throw new BadRequestException('id admin is required');

        const admin = await this.adminsRepo.findOne({
            where: { id_user: id_admin },
            relations: { partner: true },
        });
        if (!admin) throw new NotFoundException('Partner admin does not exist');
        return admin.partner;
    }
}
