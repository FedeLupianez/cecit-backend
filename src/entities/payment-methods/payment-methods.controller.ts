import { Controller, Get, Inject } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods')
export class PaymentMethodsController {
    constructor(
        @Inject() private readonly paymentsService: PaymentMethodsService,
    ) { }

    @Get('all')
    async getMethods() {
        return await this.paymentsService.getMethods();
    }
}
