import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { isEmail } from "class-validator";
import { type DataSource } from 'typeorm'

@Injectable()
export class DbService {
    constructor(@InjectDataSource() private datasource: DataSource) { }

    async get_new_id(table: string, id_col_name: string): Promise<string> {
        const queryRunner = this.datasource.createQueryRunner();
        try {
            await queryRunner.query('CALL get_new_id(?, ?, @new_id)', [table, id_col_name]);
            const result = await queryRunner.query('SELECT @new_id AS id');
            return result?.[0]?.id;
        } finally {
            await queryRunner.release();
        }
    }

    async get_new_token(): Promise<string> {
        const result = await this.datasource.query('SELECT get_new_token()');
        const new_token: string = result?.[0]?.get_new_token;
        if (!new_token) {
            throw new InternalServerErrorException('Can not generate new voucher token');
        }
        return new_token;
    }
}
