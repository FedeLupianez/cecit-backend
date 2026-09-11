import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Directions } from './directions.entity';
import {
    DirectionsCreateDTO,
    DirectionsDeleteDTO,
    DirectionsUpdateDTO,
} from './directions.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountRole } from '../accounts/accounts.dto';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';

@Injectable()
export class DirectionsService {
    constructor(
        @InjectRepository(Directions)
        private readonly repo: Repository<Directions>,
        private readonly accountsService: AccountsService,
        private readonly partnersAdminsService: PartnersAdminsService,
    ) { }

    private async assertPartnerAccess(callerId: string, id_partner: string): Promise<void> {
        if (!callerId) throw new BadRequestException('Caller id is required');
        if (!id_partner) throw new BadRequestException('id is empty');
        const caller = await this.accountsService.get_by_id(callerId);
        if (caller?.role === AccountRole.CECIT_ADMIN) return;
        await this.partnersAdminsService.verify_admin(callerId, id_partner);
    }

    async create(data: DirectionsCreateDTO, callerId: string): Promise<Directions> {
        await this.assertPartnerAccess(callerId, data.id_partner);
        const direction = this.repo.create(data);
        const saved = await this.repo.save(direction);
        if (!saved)
            throw new InternalServerErrorException('Direction was not created');
        return saved;
    }

    async createMany(
        id_partner: string,
        directions: string[],
    ): Promise<Directions[]> {
        if (!directions?.length) return [];
        const entities = directions.map((direction) =>
            this.repo.create({ id_partner, direction }),
        );
        return await this.repo.save(entities);
    }

    async findByPartner(id_partner: string): Promise<Directions[]> {
        if (!id_partner) throw new BadRequestException('id is empty');
        return await this.repo.find({ where: { id_partner } });
    }

    async update(data: DirectionsUpdateDTO, callerId: string): Promise<Directions> {
        const direction = await this.repo.findOneBy({ id_direction: data.id });
        if (!direction) throw new NotFoundException('Direction not found');
        await this.assertPartnerAccess(callerId, direction.id_partner);
        direction.direction = data.direction;
        return await this.repo.save(direction);
    }

    async remove(data: DirectionsDeleteDTO, callerId: string): Promise<boolean> {
        const direction = await this.repo.findOneBy({ id_direction: data.id });
        if (!direction) throw new NotFoundException('Direction not found');
        await this.assertPartnerAccess(callerId, direction.id_partner);
        const result = await this.repo.delete(direction);
        if (!result)
            throw new InternalServerErrorException('Error deleting direction');
        return true;
    }
}
