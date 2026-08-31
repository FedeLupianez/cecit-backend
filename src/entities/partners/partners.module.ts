import { Module, forwardRef } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersEntity } from './partners.entity';
import { PartnersController } from './partners.controller';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { DbModule } from '../../common/database/db.module';
import { AccountsModule } from '../accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { PartnerAdminGuard } from 'src/auth/partneradmin.guard';

@Module({
    imports: [TypeOrmModule.forFeature([PartnersEntity]), forwardRef(() => PartnersAdminsModule), DbModule, AccountsModule, PassportModule, UsersModule],
    providers: [PartnersService, PartnerAdminGuard],
    controllers: [PartnersController],
    exports: [PartnersService, PartnerAdminGuard]
})
export class PartnersModule { }
