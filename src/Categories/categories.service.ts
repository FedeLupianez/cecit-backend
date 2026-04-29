import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  create(data: CreateCategoryDto) {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  findAll() {
    return this.repo.find();
  }
}