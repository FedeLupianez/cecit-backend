import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import type { PartnersCreateDTO, PartnersDTO } from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersEntity) private readonly partnersRepo: Repository<PartnersEntity>,
        @Inject(forwardRef(() => PartnersAdminsService)) private readonly adminsService: PartnersAdminsService
    ) { }

    async create(partner: PartnersCreateDTO): Promise<PartnersDTO> {
        const newPartner = this.partnersRepo.create({
            name: partner.name.toLowerCase(),
            direction: partner.direction,
            logo: partner.direction
        })
        const storedPartner = await this.partnersRepo.save(newPartner);
        if (!storedPartner) {
            throw new InternalServerErrorException('Partner was not created');
        }
        const newAdmin = this.adminsService.create({
            partner: partner.name.toLowerCase(),
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
            throw new NotFoundException(`Partner with id ${id} not found`);
        const result = await this.partnersRepo.delete(partner);
        if (!result)
            throw new InternalServerErrorException('Error deleting partner');
        return true;
    }

    async get_by_name(name: string): Promise<PartnersDTO> {
        if (!name)
            throw new BadRequestException('partner name is empty');
        const stored = await this.partnersRepo.findOneBy({ name: name });
        if (!stored)
            throw new NotFoundException(`Partner with name ${name} not exists`);
        return PartnersMapper.entityToDto(stored);
    }
}
