import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginDTO, UsersCreateDTO } from 'src/entities/users/users.dto';
import type { RefreshTokenDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: UsersCreateDTO) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: UserLoginDTO) {
        return this.authService.login(body)
    }

    @Post('refresh')
    @HttpCode(200)
    async refresh(@Body() body: RefreshTokenDTO) {
        return this.authService.refresh(body)
    }

    @Post('logout')
    @HttpCode(204)
    async logout(@Body() body: RefreshTokenDTO) {
        await this.authService.logout(body.refresh_token);
    }
}
