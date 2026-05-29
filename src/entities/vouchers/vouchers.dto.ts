/*
* DTO para voucher, no se incluye el status, ni el token
*/

import { VouchersEntity, VoucherStatus } from "./vouchers.entity";

export interface VouchersDTO {
    token: string;
    id_user: string;
    id_benefit: string;
    application_date: string;
    delibery_date: string;
    status: VoucherStatus;
}

export interface VouchersCreateDTO {
    id_user: string;
    id_benefit: string;
    application_date: string;
    delibery_date: string;
}

export interface VouchersDeleteDTO {
    token: string;
    id_user: string;
}

export class VouchersMapper {
    static toDTO(voucher: VouchersEntity): VouchersDTO {
        return {
            id_user: voucher.id_user,
            id_benefit: voucher.id_benefit,
            token: voucher.token,
            application_date: voucher.application_date,
            delibery_date: voucher.delibery_date,
            status: voucher.status
        }
    }
}
