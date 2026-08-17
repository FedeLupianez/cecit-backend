import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoriesDTO, CategoriesMapper } from './categories.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesEntity)
        private repo: Repository<CategoriesEntity>,
        @Inject(CACHE_MANAGER) private cache: Cache,
    ) { }

    async create(data: CategoriesDTO) {
        const category = this.repo.create(data);
        const stored = await this.repo.save(category);
        if (!stored)
            throw new InternalServerErrorException('Error creating category');
        await this.cache.del('categories:all');
        return stored;
    }

    async findAll() {
        const cached = await this.cache.get<CategoriesDTO[]>('categories:all');
        if (cached) return cached;

        const categories = await this.repo.find();
        if (!categories) throw new NotFoundException('Categories is Empty');
        const mapped = categories.map((c) => CategoriesMapper.toDTO(c));
        await this.cache.set('categories:all', mapped);
        return mapped;
    }

    async get_by_id(id_category: number): Promise<CategoriesEntity> {
        if (!id_category) throw new BadRequestException('Id is required');
        const category = await this.repo.findOneBy({ id_category: id_category });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }
}
