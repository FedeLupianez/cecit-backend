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

@Module({
    imports: [TypeOrmModule.forFeature([PartnersEntity]), forwardRef(() => PartnersAdminsModule), DbModule, AccountsModule, PassportModule, UsersModule],
    providers: [PartnersService],
    controllers: [PartnersController],
    exports: [PartnersService]
})
export class PartnersModule { }
