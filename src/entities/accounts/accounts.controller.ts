import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsUpdateDTO, UpdateRoleDTO } from './accounts.dto';
import { AuthGuard } from '@nestjs/passport';
import { CecitAdminGuard } from 'src/auth/cecitadmin.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Get('all')
    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    get_all() {
        return this.accountsService.get_all();
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'), CecitAdminGuard)
    update(@Body() dto: AccountsUpdateDTO) {
        return this.accountsService.update(dto);
    }

    @Patch('role')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    async changeRole(@Body() body: UpdateRoleDTO) {
        return await this.accountsService.changeRole(body);
    }
}
