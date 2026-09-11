import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersCategoriesEntity } from './partners_categories.entity';
import { PartnersCategoriesDto } from './partners_categories.dto';
import { AccountsService } from '../accounts/accounts.service';
import { AccountRole } from '../accounts/accounts.dto';
import { PartnersAdminsService } from '../partnersadmins/partnersadmins.service';

@Injectable()
export class PartnersCategoriesService {
    constructor(
        @InjectRepository(PartnersCategoriesEntity)
        private repo: Repository<PartnersCategoriesEntity>,
        private readonly accountsService: AccountsService,
        private readonly partnersAdminsService: PartnersAdminsService,
    ) { }

    async create(data: PartnersCategoriesDto, callerId: string) {
        if (!callerId) throw new BadRequestException('Caller id is required');
        const caller = await this.accountsService.get_by_id(callerId);
        if (caller?.role !== AccountRole.CECIT_ADMIN) {
            await this.partnersAdminsService.verify_admin(callerId, data.id_partner);
        }
        const relation = this.repo.create(data);
        return await this.repo.save(relation);
    }

    async findAll() {
        return await this.repo.find({
            relations: ['partner', 'category'],
        });
    }

    async findByPartner(id_partner: string): Promise<PartnersCategoriesEntity[]> {
        return await this.repo.find({
            where: { id_partner },
            relations: ['category'],
        });
    }
}
