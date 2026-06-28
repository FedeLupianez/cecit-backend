import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { PartnersCreateDTO, PartnersDTO, PartnersUpdateLogoDTO, PartnersUpdateNameDTO } from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersEntity) private readonly partnersRepo: Repository<PartnersEntity>,
        private readonly dbService: DbService
    ) { }

    async create(partner: PartnersCreateDTO): Promise<PartnersEntity> {
        const newId = await this.dbService.getNewId('Partners', 'id_partner');
        const newPartner = this.partnersRepo.create({
            id_partner: newId,
            name: partner.partner_name.toLowerCase(),
            direction: partner.direction,
            logo: partner.logo
        })
        const storedPartner = await this.partnersRepo.save(newPartner);
        if (!storedPartner) {
            throw new InternalServerErrorException('Partner was not created');
        }
        return storedPartner;
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

    async updateLogo(data: PartnersUpdateLogoDTO): Promise<PartnersDTO> {
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner)
            throw new BadRequestException('Partner not exists');
        partner.logo = data.new_logo;
        this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }


    async updateName(data: PartnersUpdateNameDTO): Promise<PartnersDTO> {
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner)
            throw new BadRequestException('Partner not exists');
        partner.name = data.new_name.toLowerCase();
        this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

}
