/*
* DTO para voucher, no se incluye el status, ni el token
*/


export class VouchersDTO {
    id_voucher: number
    id_user: number
    id_benefit: number
    token: string
    application_date: Date
    delibery_date: Date
}
