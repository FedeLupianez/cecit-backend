import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDTO, CategoriesMapper } from './categories.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private service: CategoriesService) { }

    @Post('create')
    async create(@Body() body: CategoriesDTO) {
        const newCategory = await this.service.create(body);
        return CategoriesMapper.toDTO(newCategory);
    }

    @Get('all')
    async findAll() {
        return await this.service.findAll();
    }
}
