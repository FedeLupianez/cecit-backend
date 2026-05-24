import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginDTO } from 'src/entities/users/users.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject() private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    singIn(@Body() user_login: UserLoginDTO) {
        return this.authService.singIn(user_login)
    }
}
