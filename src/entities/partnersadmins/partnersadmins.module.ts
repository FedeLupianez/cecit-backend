import { Module, forwardRef } from '@nestjs/common';
import { PartnersAdminsController } from './partnersadmins.controller';
import { PartnersAdminsService } from './partnersadmins.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersAdminsEntity } from './partnersadmins.entity';
import { DbModule } from 'src/common/database/db.module';
import { PartnersModule } from '../partners/partners.module';
import { AccountsModule } from '../accounts/accounts.module';
import { AdminGuard } from 'src/auth/admin.guard';


@Module({
    imports: [TypeOrmModule.forFeature([PartnersAdminsEntity]), DbModule, forwardRef(() => PartnersModule), AccountsModule],
    controllers: [PartnersAdminsController],
    providers: [PartnersAdminsService, AdminGuard],
    exports: [PartnersAdminsService]
})
export class PartnersAdminsModule { }
