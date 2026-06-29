import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitTypeService } from './benefit-types.service';
import { BenefitTypeController } from './benefit-types.controller';
import { BenefitTypeEntity } from './benefit-types.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [TypeOrmModule.forFeature([BenefitTypeEntity]), AccountsModule, PassportModule],
    controllers: [BenefitTypeController],
    providers: [BenefitTypeService],
    exports: [BenefitTypeService]
})
export class BenefitTypeModule { }
