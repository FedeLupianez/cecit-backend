import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDTO } from './categories.dto';

@Controller('categories')
export class CategoriesController {

    constructor(private service: CategoriesService) { }

    @Post()
    create(@Body() body: CategoriesDTO) {
        return this.service.create(body);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
