import { Module, forwardRef } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersEntity } from './partners.entity';
import { PartnersController } from './partners.controller';
import { PartnersAdminsModule } from '../partnersadmins/partnersadmins.module';
import { DbModule } from '../../common/database/db.module';

@Module({
    imports: [TypeOrmModule.forFeature([PartnersEntity]), forwardRef(() => PartnersAdminsModule), DbModule],
    providers: [PartnersService],
    controllers: [PartnersController],
    exports: [PartnersService]
})
export class PartnersModule { }
