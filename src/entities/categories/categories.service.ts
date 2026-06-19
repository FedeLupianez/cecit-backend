import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoriesDTO, CategoriesMapper } from './categories.dto';


@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoriesEntity)
        private repo: Repository<CategoriesEntity>,
    ) { }

    async create(data: CategoriesDTO) {
        const category = this.repo.create(data);
        const stored = await this.repo.save(category);
        if (!stored)
            throw new InternalServerErrorException('Error creating category');
        return await this.repo.save(category);
    }

    async findAll() {
        const categories = await this.repo.find();
        if (!categories)
            throw new NotFoundException('Categories is Empty');
        const mapped = categories.map((c) => CategoriesMapper.toDTO(c));
        return mapped;
    }
}
