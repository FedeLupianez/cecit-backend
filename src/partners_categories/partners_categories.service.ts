import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersCategoriesEntity } from './partners_categories.entity';

@Injectable()
export class PartnersCategoriesService {
    constructor(
        @InjectRepository(PartnersCategoriesEntity)
        private repo: Repository<PartnersCategoriesEntity>,
    ) { }

    create(data: PartnersCategoriesEntity) {
        const relation = this.repo.create(data);
        return this.repo.save(relation);
    }

    findAll() {
        return this.repo.find({
            relations: ['partners', 'categories'],
        });
    }
}
