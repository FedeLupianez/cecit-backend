import { Module, forwardRef } from '@nestjs/common';
import { PartnersAdminsController } from './partnersadmins.controller';
import { PartnersAdminsService } from './partnersadmins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { PartnersController } from '../partners/partners.controller';
import { PartnersEntity } from '../partners/partners.entity';
import { AdminGuard } from 'src/auth/admin.guard';
import { DbModule } from 'src/common/database/db.module';
import { AccountsModule } from '../accounts/accounts.module';
import { PartnersModule } from '../partners/partners.module';
import { PassportModule } from '@nestjs/passport';


@Module({
    imports: [TypeOrmModule.forFeature([PartnersAdminsEntity, PartnersEntity]), DbModule, AccountsModule, forwardRef(() => PartnersModule), PassportModule],
    controllers: [PartnersAdminsController, PartnersController],
    providers: [PartnersAdminsService, AdminGuard],
    exports: [PartnersAdminsService]
})
export class PartnersAdminsModule { }
