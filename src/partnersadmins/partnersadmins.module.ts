import { Module } from '@nestjs/common';
import { PartnersAdminsController } from './partnersadmins.controller';
import { PartnersAdminsService } from './partnersadmins.service';

@Module({
    controllers: [PartnersAdminsController],
    providers: [PartnersAdminsService]
})
export class PartnersAdminsModule { }
