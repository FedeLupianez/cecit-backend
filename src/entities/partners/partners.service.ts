import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import type {
    AddLocationDTO,
    GetLocationsReturn,
    PartnerLogo,
    PartnersCreateDTO,
    PartnersDTO,
    PartnersUpdateLogoDTO,
    PartnersUpdateNameDTO,
} from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbService } from 'src/common/database/db.service';
import { DirectionsService } from './directions.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersEntity)
        private readonly partnersRepo: Repository<PartnersEntity>,
        private readonly dbService: DbService,
        private readonly directionsService: DirectionsService,
    ) { }

    async get_all(): Promise<PartnerLogo[]> {
        const partners = await this.partnersRepo.find({
            select: {
                name: true,
                logo: true,
            },
        });
        if (!partners) throw new NotFoundException('Partners are empty');
        return partners;
    }

    async create(partner: PartnersCreateDTO): Promise<PartnersEntity> {
        const newId = await this.dbService.getNewId('Partners', 'id_partner');
        const newPartner = this.partnersRepo.create({
            id_partner: newId,
            name: partner.partner_name.toLowerCase(),
            logo: partner.logo,
        });
        const storedPartner = await this.partnersRepo.save(newPartner);
        if (!storedPartner) {
            throw new InternalServerErrorException('Partner was not created');
        }
        if (partner.directions?.length) {
            await this.directionsService.createMany(newId, partner.directions);
        }
        return storedPartner;
    }

    async remove(id: string): Promise<boolean> {
        if (!id) throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOneBy({ id_partner: id });
        if (!partner) throw new NotFoundException('Partner not found');
        const result = await this.partnersRepo.delete(partner);
        if (!result)
            throw new InternalServerErrorException('Error deleting partner');
        return true;
    }

    async get_by_id(id_partner: string): Promise<PartnersEntity> {
        if (!id_partner) throw new BadRequestException('id is empty');
        const partner = await this.partnersRepo.findOneBy({
            id_partner: id_partner,
        });
        if (!partner) throw new NotFoundException('Partner not found');
        return partner;
    }

    async get_by_name(name: string): Promise<PartnersDTO> {
        if (!name) throw new BadRequestException('partner name is empty');
        const stored = await this.partnersRepo.findOne({
            where: { name: name },
            relations: { directions: true },
        });
        if (!stored) throw new NotFoundException('Partner not exists');
        return PartnersMapper.entityToDto(stored);
    }

    async updateLogo(data: PartnersUpdateLogoDTO): Promise<PartnersDTO> {
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner) throw new BadRequestException('Partner not exists');
        partner.logo = data.new_logo;
        this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

    async updateName(data: PartnersUpdateNameDTO): Promise<PartnersDTO> {
        const partner = await this.partnersRepo.findOneBy({
            id_partner: data.id_partner,
        });
        if (!partner) throw new BadRequestException('Partner not exists');
        partner.name = data.new_name.toLowerCase();
        await this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

    async getByOwnerId(id_owner: string): Promise<PartnersEntity | null> {
        return await this.partnersRepo.findOne({
            where: {
                id_owner,
            },
        });
    }

    async addLocation({ id_partner, direction }: AddLocationDTO): Promise<boolean> {
        const partner = await this.partnersRepo.findOneBy({ id_partner });
        if (!partner) throw new NotFoundException('Partner not found');
        await this.directionsService.create({ id_partner, direction });
        return true;
    }

    async getLocations(id_partner: string): Promise<GetLocationsReturn[]> {
        const directions = await this.directionsService.findByPartner(id_partner);
        return directions.map((d) => {
            return {
                id_partner: d.id_partner,
                id_location: d.id_direction,
                direction: d.direction
            }
        })
    }
}
