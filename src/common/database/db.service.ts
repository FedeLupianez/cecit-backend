import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { type DataSource } from 'typeorm'

@Injectable()
export class DbService {
    constructor(@InjectDataSource() private datasource: DataSource) { }

    async get_new_id(table: string, id_col_name: string): Promise<string> {
        const result = await this.datasource.query('CALL get_new_id(?, ?)', [table, id_col_name]);
        const new_id: string = result?.[0]?.[0]?.id;
        return new_id;
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
