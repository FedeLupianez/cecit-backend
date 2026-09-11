import {
    Body,
    Controller,
    Delete,
    Patch,
    Post,
    Req,
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
    async create(@Body() body: DirectionsCreateDTO, @Req() req) {
        return await this.directionsService.create(body, req.user?.user_id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch()
    async update(@Body() body: DirectionsUpdateDTO, @Req() req) {
        return await this.directionsService.update(body, req.user?.user_id);
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Delete()
    async remove(@Body() body: DirectionsDeleteDTO, @Req() req) {
        return await this.directionsService.remove(body, req.user?.user_id);
    }
}
