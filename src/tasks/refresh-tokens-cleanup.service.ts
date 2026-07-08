import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class RefreshTokensCleanupService {
    constructor(@InjectRepository(RefreshTokenEntity) private readonly refreshTokens: Repository<RefreshTokenEntity>) { }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async handleCleanUp() {
        await this.refreshTokens.delete({
            expires_at: LessThan(new Date())
        })
    }
}
