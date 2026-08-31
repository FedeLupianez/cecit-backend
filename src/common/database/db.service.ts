import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmail } from 'class-validator';
import { type DataSource } from 'typeorm';

@Injectable()
export class DbService {
    constructor(@InjectDataSource() private datasource: DataSource) { }

    async getNewId(table: string, idColName: string): Promise<string> {
        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.query('CALL get_new_id(?, ?, @new_id)', [
                table,
                idColName,
            ]);
            const result = await queryRunner.query('SELECT @new_id AS id');
            return result?.[0]?.id;
        } finally {
            await queryRunner.release();
        }
    }

    async getNewToken(): Promise<string> {
        const result = await this.datasource.query(
            'SELECT get_new_token() AS token',
        );
        const newToken: string = result?.[0]?.token;
        if (!newToken) {
            throw new InternalServerErrorException(
                'Can not generate new voucher token',
            );
        }
        return newToken;
    }
}
