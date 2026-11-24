import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitsEntity } from './benefits.entity';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { CategoriesModule } from '../categories/categories.module';
import { PartnersModule } from '../partners/partners.module';
import { AccountsModule } from '../accounts/accounts.module';
import { BenefitTypeModule } from '../benefit-types/benefit-types.module';
import { PaymentMethodsEntity } from '../payment-methods/payment-methods.entity';
import { AdminGuard } from 'src/auth/admin.guard';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BenefitsEntity, PaymentMethodsEntity]),
    CategoriesModule,
    PartnersModule,
    AccountsModule,
    BenefitTypeModule,
    PartnersAdminsModule,
  ],
  providers: [BenefitsService, AdminGuard],
  controllers: [BenefitsController],
  exports: [BenefitsService],
})
export class BenefitsModule {}
