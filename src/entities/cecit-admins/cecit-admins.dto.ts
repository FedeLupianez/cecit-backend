import { Consumer } from "src/consumer/consumer.dto";
import { CecitAdminsEntity } from "./cecit-admins.entity";
import { IsEmail, IsNotEmpty } from "class-validator";

export interface CecitAdminsDTO {
    id_c_admin: string;
    email: string;
}

export class CecitAdminsCreateDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class CecitAdminsMapper {
    static toDTO(admin: CecitAdminsEntity): CecitAdminsDTO {
        return {
            id_c_admin: admin.id_c_admin,
            email: admin.email
        }

    }

    static toConsumer(admin: CecitAdminsEntity): Consumer {
        return {
            id_consumer: admin.id_c_admin,
            email: admin.email,
            password: admin.password
        }
    }
}
