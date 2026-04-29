import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnersCategories } from './partners_categories.entity';

@Injectable()
export class PartnersCategoriesService {
  constructor(
    @InjectRepository(PartnersCategories)
    private repo: Repository<PartnersCategories>,
  ) {}

  create(data: PartnersCategories) {
    const relation = this.repo.create(data);
    return this.repo.save(relation);
  }

  findAll() {
    return this.repo.find({
      relations: ['partner', 'category'],
    });
  }
}