import { Module } from '@nestjs/common';
import { RefreshTokensCleanupService } from './refresh-tokens-cleanup.service';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
    providers: [RefreshTokensCleanupService]
})
export class TasksModule { }
