import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersCategoriesEntity } from './partners_categories.entity';
import { PartnersCategoriesDto } from './partners_categories.dto';

@Injectable()
export class PartnersCategoriesService {
    constructor(
        @InjectRepository(PartnersCategoriesEntity)
        private repo: Repository<PartnersCategoriesEntity>,
    ) { }

    async create(data: PartnersCategoriesDto) {
        const relation = this.repo.create(data);
        return await this.repo.save(relation);
    }

    async findAll() {
        return await this.repo.find({
            relations: ['partner', 'category'],
        });
    }
}
