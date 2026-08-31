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

export interface VoucherReturn {
    title: string;
    image: string;
    partner: string;
    endDate: Date;
    methods: string[];
    directions: string[];
    logo: string;
    token: string;
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

export interface VoucherBenefitUser {
    id_benefit: string;
    id_account: string;
}

export interface ReturnCouponsUser {
    id_account: string;
    coupons: number;
}

export interface VoucherPartnerView extends VoucherReturn {
    user_name: string;
    user_dni: string;
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
