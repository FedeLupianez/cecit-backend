import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PartnersService } from './partners.service';
import type { PartnersCreateDTO } from './partners.dto';


@Controller('partners')
export class PartnersController {

    constructor(private readonly partnersService: PartnersService) { }

    @Post()
    async create(@Body() dto: PartnersCreateDTO) {
        return this.partnersService.create(dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }
}
