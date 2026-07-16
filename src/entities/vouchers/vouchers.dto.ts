/*
 * DTO para voucher, no se incluye el status, ni el token
 */

import { VouchersEntity, VoucherStatus } from './vouchers.entity';

export interface VouchersDTO {
    token: string;
    id_user: string;
    id_benefit: string;
    application_date: Date;
    delivery_date: Date;
    status: VoucherStatus;
}

export interface VouchersCreateDTO {
    id_user: string;
    id_benefit: string;
}

export interface VouchersDeleteDTO {
    token: string;
    id_user: string;
}

export interface VoucherFileDTO {
    token: string;
}

export class VouchersMapper {
    static toDTO(voucher: VouchersEntity): VouchersDTO {
        return {
            id_user: voucher.id_user,
            id_benefit: voucher.id_benefit,
            token: voucher.token,
            application_date: voucher.application_date,
            delivery_date: voucher.delivery_date,
            status: voucher.status,
        };
    }
}
