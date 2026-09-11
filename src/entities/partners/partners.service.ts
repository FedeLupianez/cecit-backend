import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import type {
    AddLocationDTO,
    GetLocationsReturn,
    PartnersCreateDTO,
    PartnersDTO,
    PartnersUpdateLogoDTO,
    PartnersUpdateNameDTO,
} from './partners.dto';
import { PartnersEntity } from './partners.entity';
import { PartnersMapper } from './partners.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectionsService } from './directions.service';
import { generateUniqueId } from 'src/common/utils/id-generator';
import { AccountsService } from '../accounts/accounts.service';
import { AccountRole } from '../accounts/accounts.dto';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';

@Injectable()
export class PartnersService {
    constructor(
        @InjectRepository(PartnersEntity)
        private readonly partnersRepo: Repository<PartnersEntity>,
        private readonly directionsService: DirectionsService,
        private readonly accountsService: AccountsService,
        @Inject(forwardRef(() => PartnersAdminsService))
        private readonly partnersAdminsService: PartnersAdminsService,
    ) { }

    private async assertPartnerAccess(callerId: string, id_partner: string): Promise<void> {
        if (!callerId) throw new BadRequestException('Caller id is required');
        if (!id_partner) throw new BadRequestException('id is empty');
        const caller = await this.accountsService.get_by_id(callerId);
        if (caller?.role === AccountRole.CECIT_ADMIN) return;
        await this.partnersAdminsService.verify_admin(callerId, id_partner);
    }

    async get_all(): Promise<PartnersDTO[]> {
        const partners = await this.partnersRepo.find({
            relations: { directions: true },
            order: { name: 'ASC' },
        });
        if (!partners) throw new NotFoundException('Partners are empty');
        return partners.map((partner) =>
            PartnersMapper.entityToDto(partner),
        );
    }

    async create(partner: PartnersCreateDTO): Promise<PartnersEntity> {
        const newId = await generateUniqueId(this.partnersRepo, 'id_partner');
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

    async updateLogo(data: PartnersUpdateLogoDTO, callerId: string): Promise<PartnersDTO> {
        await this.assertPartnerAccess(callerId, data.id_partner);
        const partner = await this.partnersRepo.findOneBy({ id_partner: data.id_partner });
        if (!partner) throw new BadRequestException('Partner not exists');
        partner.logo = data.new_logo;
        await this.partnersRepo.save(partner);
        return PartnersMapper.entityToDto(partner);
    }

    async updateName(data: PartnersUpdateNameDTO, callerId: string): Promise<PartnersDTO> {
        await this.assertPartnerAccess(callerId, data.id_partner);
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

    async addLocation({ id_partner, direction }: AddLocationDTO, callerId: string): Promise<boolean> {
        await this.assertPartnerAccess(callerId, id_partner);
        const partner = await this.partnersRepo.findOneBy({ id_partner });
        if (!partner) throw new NotFoundException('Partner not found');
        await this.directionsService.create({ id_partner, direction }, callerId);
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
