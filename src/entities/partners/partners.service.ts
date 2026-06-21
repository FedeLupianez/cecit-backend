import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import type { PartnersCreateDTO, PartnersDTO, PartnersUpdateLogoDTO, PartnersUpdateNameDTO } from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';
import { DbService } from 'src/common/database/db.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersEntity) private readonly partnersRepo: Repository<PartnersEntity>,
        @Inject(forwardRef(() => PartnersAdminsService)) private readonly adminsService: PartnersAdminsService,
        private readonly db_service: DbService
    ) { }

    async create(partner: PartnersCreateDTO): Promise<PartnersDTO> {
        const new_id = await this.db_service.get_new_id('Partners', 'id_partner');
        const newPartner = this.partnersRepo.create({
            id_partner: new_id,
            name: partner.partner_name.toLowerCase(),
            direction: partner.direction,
            logo: partner.logo
        })
        const storedPartner = await this.partnersRepo.save(newPartner);
        if (!storedPartner) {
            throw new InternalServerErrorException('Partner was not created');
        }
        const newAdmin = this.adminsService.create({
            partner_name: partner.partner_name.toLowerCase(),
            email: partner.email,
            password: partner.password
        });
        if (!newAdmin)
            throw new InternalServerErrorException('Error creating new Admin');
        return PartnersMapper.entityToDto(storedPartner);
    }

    async remove(id: string): Promise<boolean> {
        if (!id)
            throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOneBy({ id_partner: id });
        if (!partner)
            throw new NotFoundException('Partner not found');
        const result = await this.partnersRepo.delete(partner);
        if (!result)
            throw new InternalServerErrorException('Error deleting partner');
        return true;
    }

    async get_by_id(id_partner: string): Promise<PartnersEntity> {
        if (!id_partner)
            throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOneBy({ id_partner: id_partner });
        if (!partner)
            throw new NotFoundException('Partner not found');
        return partner;
    }

    async get_by_name(name: string): Promise<PartnersDTO> {
        if (!name)
            throw new BadRequestException('partner name is empty');
        const stored = await this.partnersRepo.findOneBy({ name: name });
        if (!stored)
            throw new NotFoundException('Partner not exists');
        return PartnersMapper.entityToDto(stored);
    }

    async update_logo(data: PartnersUpdateLogoDTO): Promise<PartnersDTO> {
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner)
            throw new BadRequestException('Partner not exists');
        partner.logo = data.new_logo;
        this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }


    async update_name(data: PartnersUpdateNameDTO): Promise<PartnersDTO> {
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner)
            throw new BadRequestException('Partner not exists');
        partner.name = data.new_name.toLowerCase();
        this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

}
