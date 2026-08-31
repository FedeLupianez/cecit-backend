import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from 'src/entities/accounts/accounts.service';
import { AccountRole } from 'src/entities/accounts/accounts.dto';

@Injectable()
export class PartnerAdminGuard implements CanActivate {
    constructor(private readonly accountService: AccountsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user?.email) throw new UnauthorizedException('Not authenticated');

        const account = await this.accountService.get_by_email(request.user.email);
        if (account.role !== AccountRole.PARTNER_ADMIN) {
            throw new UnauthorizedException('Partner admin access required');
        }
        return true;
    }
}
