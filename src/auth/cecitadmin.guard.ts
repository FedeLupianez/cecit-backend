import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountRole } from 'src/entities/accounts/accounts.dto';
import { AccountsService } from 'src/entities/accounts/accounts.service';

@Injectable()
export class CecitAdminGuard implements CanActivate {
  constructor(private readonly accountService: AccountsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) throw new UnauthorizedException('Not authenticated');
    // Fast-path: el rol viene firmado en el JWT (vigencia corta del access
    // token). Si falta o no es admin, se verifica contra la DB, que es la
    // fuente de verdad (cubre tokens viejos sin rol o cambios de rol).
    if (request.user.role === AccountRole.CECIT_ADMIN) return true;
    if (request.user.role) throw new UnauthorizedException('Admin access required');
    const user = await this.accountService.get_by_email(request.user.email);
    if (!user) throw new NotFoundException('Admin not found');
    if (user.role != AccountRole.CECIT_ADMIN)
      throw new UnauthorizedException('Admin access required');
    return true;
  }
}
