import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesDto } from './partners_categories.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('partners-categories')
export class PartnersCategoriesController {
    constructor(private service: PartnersCategoriesService) { }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Post()
    async create(@Body() body: PartnersCategoriesDto, @Req() req) {
        return await this.service.create(body, req.user?.user_id);
    }

    @Get()
    async findAll() {
        return await this.service.findAll();
    }
}
