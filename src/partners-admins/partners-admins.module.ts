import { Module } from '@nestjs/common';
import { PartnersAdminsController } from './partners-admins.controller';
import { PartnersAdminsService } from './partners-admins.service';

@Module({
  controllers: [PartnersAdminsController],
  providers: [PartnersAdminsService]
})
export class PartnersAdminsModule {}
