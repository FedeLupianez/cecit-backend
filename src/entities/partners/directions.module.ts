import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Directions } from './directions.entity';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AdminGuard } from 'src/auth/admin.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([Directions]),
        forwardRef(() => PartnersAdminsModule),
        AccountsModule,
    ],
    controllers: [DirectionsController],
    providers: [DirectionsService, AdminGuard],
    exports: [DirectionsService],
})
export class DirectionsModule {}
