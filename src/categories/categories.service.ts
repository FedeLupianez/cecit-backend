import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoriesDTO } from './categories.dto';


@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(CategoriesEntity)
        private repo: Repository<CategoriesEntity>,
    ) { }

    create(data: CategoriesDTO) {
        const category = this.repo.create(data);
        return this.repo.save(category);
    }

    findAll() {
        return this.repo.find();
    }
}
