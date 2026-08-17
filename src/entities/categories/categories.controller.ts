import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesDTO, CategoriesMapper } from './categories.dto';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';

@Controller('categories')
export class CategoriesController {
    constructor(private service: CategoriesService) { }

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
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
