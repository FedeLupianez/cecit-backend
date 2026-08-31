import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directions } from './directions.entity';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Directions]),
        forwardRef(() => PartnersAdminsModule),
    ],
    controllers: [DirectionsController],
    providers: [DirectionsService],
    exports: [DirectionsService],
})
export class DirectionsModule {}
