import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
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

    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    @Patch(':id_category')
    async toggleActive(
        @Param('id_category') id_category: string,
        @Body('active') active: boolean,
    ) {
        const updated = await this.service.toggleActive(Number(id_category), active);
        return CategoriesMapper.toDTO(updated);
    }

    @Get('all')
    async findAll() {
        return await this.service.findAll();
    }

    @Get('actives')
    async getActives() {
        return await this.service.findActives();
    }

}
