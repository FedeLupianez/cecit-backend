import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity]), AccountsModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule { }
