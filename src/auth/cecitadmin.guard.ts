import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AccountRole } from "src/entities/accounts/accounts.dto";
import { AccountsService } from "src/entities/accounts/accounts.service";

@Injectable()
export class CecitAdminGuard implements CanActivate {
    constructor(private readonly accountService: AccountsService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.user)
            throw new UnauthorizedException('Not authenticated');
        const user = await this.accountService.get_by_email(request.user.email);
        if (!user)
            throw new NotFoundException('Admin not found')
        if (user.role != AccountRole.CECIT_ADMIN)
            throw new UnauthorizedException('Admin access required');
        return true;
    }
}
