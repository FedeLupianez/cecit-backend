import { Module, forwardRef } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersEntity } from './partners.entity';
import { UsersEntity } from '../users/users.entity';
import { AccountsEntity } from '../accounts/accounts.entity';
import { PartnersController } from './partners.controller';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { AccountsModule } from '../accounts/accounts.module';
import { DirectionsModule } from './directions.module';
import { UsersModule } from '../users/users.module';
import { AdminGuard } from 'src/auth/admin.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([PartnersEntity, UsersEntity, AccountsEntity]),
        forwardRef(() => PartnersAdminsModule),
        AccountsModule,
        DirectionsModule,
        UsersModule,
    ],
    providers: [PartnersService, AdminGuard],
    controllers: [PartnersController],
    exports: [PartnersService],
})
export class PartnersModule { }
