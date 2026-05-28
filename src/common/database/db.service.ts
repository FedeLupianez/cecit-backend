import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { type DataSource } from 'typeorm'

@Injectable()
export class DbService {
    constructor(@InjectDataSource() private datasource: DataSource) { }

    async gen_new_id(table: string, id_col_name: string): Promise<string | null> {
        const result = await this.datasource.query('CALL get_new_id(?, ?)', [table, id_col_name]);
        const new_id: string = result?.[0]?.[0]?.id;
        return new_id;
    }

}
