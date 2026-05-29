import { CecitAdminsEntity } from "./cecit-admins.entity";

export interface CecitAdminsDTO {
    id_c_admin: string;
    email: string;
}

export class CecitAdminsMapper {
    static toDTO(admin: CecitAdminsEntity): CecitAdminsDTO {
        return {
            id_c_admin: admin.id_c_admin,
            email: admin.email
        }

    }
}
