import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { UserLoginDTO } from 'src/entities/users/users.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    signIn(@Body() body: UserLoginDTO) {
        return this.authService.login(body)
    }
}
