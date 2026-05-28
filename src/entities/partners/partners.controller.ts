import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { type PartnersDTO } from './partners.dto';


@Controller('partners')
export class PartnersController {

    constructor(private readonly partnersService: PartnersService) {}

    @Post()
    create(@Body() dto: PartnersDTO) {
        return this.partnersService.create(dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.partnersService.remove(id);
    }
}