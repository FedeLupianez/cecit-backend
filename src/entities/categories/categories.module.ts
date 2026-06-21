import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesEntity } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CecitAdminsModule } from 'src/entities/cecit-admins/cecit-admins.module';

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesEntity]), CecitAdminsModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
})
export class CategoriesModule { }
