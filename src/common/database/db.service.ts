import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { isEmail } from "class-validator";
import { Consumer } from "src/consumer/consumer.dto";
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

    async get_user_email(email: string): Promise<Consumer> {
        if (!email || !isEmail(email))
            throw new BadRequestException('Email is required');
        const result = await this.datasource.query(`
            SELECT 
                u.id_user,
                u.email,
                u.password,
                u.name,
                u.lastname,
                u.dni
            FROM UsersNasked u
            WHERE u.email = $1

            UNION ALL

            SELECT 
                pa.id_partner,
                pa.email,
                pa.password,
                NULL AS name,
                NULL AS lastname,
                NULL AS dni,
            FROM PartnersAdmins pa
            WHERE pa.email = $1

            UNION ALL

            SELECT 
                ca.id_c_admin,
                ca.email,
                ca.password,
                NULL AS name,
                NULL AS lastname,
                NULL AS dni,
            FROM CecitAdmins ca
            WHERE ca.email = $1
        `, [email]);
        if (result.lenght === 0)
            throw new NotFoundException('User not found');
        return result[0];
    }

    async get_user_id(id: string): Promise<Consumer> {
        if (!id)
            throw new BadRequestException('Id is required');
        const result = await this.datasource.query(`
            SELECT 
                u.id_user,
                u.email,
                u.password,
                u.name,
                u.lastname,
                u.dni
            FROM UsersNasked u
            WHERE u.id_user = $1

            UNION ALL

            SELECT 
                pa.id_partner,
                pa.email,
                pa.password,
                NULL AS name,
                NULL AS lastname,
                NULL AS dni,
            FROM PartnersAdmins pa
            WHERE pa.id_p_admin = $1

            UNION ALL

            SELECT 
                ca.id_c_admin,
                ca.email,
                ca.password,
                NULL AS name,
                NULL AS lastname,
                NULL AS dni,
            FROM CecitAdmins ca
            WHERE ca.id_c_admin = $1
        `, [id]);
        if (result.lenght === 0)
            throw new NotFoundException('User not found');
        return result[0];
    }
}
