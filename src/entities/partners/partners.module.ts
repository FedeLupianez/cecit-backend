import { Module, forwardRef } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersEntity } from './partners.entity';
import { PartnersController } from './partners.controller';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { AccountsModule } from '../accounts/accounts.module';
import { DirectionsModule } from './directions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PartnersEntity]),
        forwardRef(() => PartnersAdminsModule),
        AccountsModule,
        DirectionsModule,
    ],
    providers: [PartnersService],
    controllers: [PartnersController],
    exports: [PartnersService],
})
export class PartnersModule { }
