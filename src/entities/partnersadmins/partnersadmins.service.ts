import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { Repository } from 'typeorm';
import { type PartnersAdminsCreateDTO } from './partnersadmins.dto';
import { PartnersService } from '../partners/partners.service';
import { DbService } from 'src/common/database/db.service';

@Injectable()
export class PartnersAdminsService {
    constructor(
        @InjectRepository(PartnersAdminsEntity)
        private readonly adminsRepo: Repository<PartnersAdminsEntity>,
        @Inject(forwardRef(() => PartnersService))
        private readonly partnersService: PartnersService,
        private readonly dbService: DbService,
    ) { }

    async create(admin: PartnersAdminsCreateDTO): Promise<PartnersAdminsEntity> {
        const partner = await this.partnersService.get_by_name(admin.partner_name);
        const newId = await this.dbService.getNewId('Partners_Admins', 'id_account');
        const newAdmin = this.adminsRepo.create({
            id_account: newId,
            id_partner: partner.id_partner,
        });

        const stored = await this.adminsRepo.save(newAdmin);
        if (!stored)
            throw new InternalServerErrorException('Error creating new Admin');
        return stored;
    }

    async createByOwner(
        id_account: string,
        id_partner: string,
    ): Promise<PartnersAdminsEntity> {
        if (!id_account || !id_partner)
            throw new BadRequestException('id_account and id_partner are required');
        const newAdmin = this.adminsRepo.create({ id_account: id_account, id_partner });
        const stored = await this.adminsRepo.save(newAdmin);
        if (!stored)
            throw new InternalServerErrorException('Error creating admin by owner');
        return stored;
    }

    async get_by_id(id_admin: string): Promise<PartnersAdminsEntity> {
        if (!id_admin) throw new BadRequestException('id admin is required');
        const admin = await this.adminsRepo.findOne({
            where: { id_account: id_admin },
            relations: ['partner', 'partner.directions', 'account'],
        });
        if (!admin) throw new NotFoundException('Admin does not exists');
        return admin;
    }
}
