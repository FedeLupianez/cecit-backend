/*
* Modulo de Voucher para el uso en todo el sistema
*/
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VouchersEntity } from "./vouchers.entity"
import { VouchersController } from "./vouchers.controller"
import { VouchersService } from "./vouchers.service"

@Module({
    imports: [TypeOrmModule.forFeature([VouchersEntity])],
    controllers: [VouchersController],
    providers: [VouchersService],
    exports: [VouchersService]
})
export class VouchersModule { }
