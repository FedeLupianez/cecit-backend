import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsEntity } from './accounts.entity';
import { PartnersAdminsEntity } from '../partnersadmins/partnersadmins.entity';
import { AdminGuard } from 'src/auth/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([AccountsEntity, PartnersAdminsEntity])],
  controllers: [AccountsController],
  providers: [AccountsService, AdminGuard],
  exports: [AccountsService],
})
export class AccountsModule {}
