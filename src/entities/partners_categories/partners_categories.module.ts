import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersCategoriesEntity } from './partners_categories.entity';
import { PartnersCategoriesService } from './partners_categories.service';
import { PartnersCategoriesController } from './partners_categories.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { AdminGuard } from 'src/auth/admin.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([PartnersCategoriesEntity]),
        AccountsModule,
        PartnersAdminsModule,
    ],
    controllers: [PartnersCategoriesController],
    providers: [PartnersCategoriesService, AdminGuard],
    exports: [PartnersCategoriesService],
})
export class PartnersCategoriesModule { }
