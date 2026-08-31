import {
    Body,
    Controller,
    Delete,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { DirectionsService } from './directions.service';
import {
    DirectionsCreateDTO,
    DirectionsDeleteDTO,
    DirectionsUpdateDTO,
} from './directions.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('directions')
export class DirectionsController {
    constructor(private readonly directionsService: DirectionsService) {}

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Post()
    async create(@Body() body: DirectionsCreateDTO) {
        return await this.directionsService.create(body);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch()
    async update(@Body() body: DirectionsUpdateDTO) {
        return await this.directionsService.update(body);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete()
    async remove(@Body() body: DirectionsDeleteDTO) {
        return await this.directionsService.remove(body);
    }
}
