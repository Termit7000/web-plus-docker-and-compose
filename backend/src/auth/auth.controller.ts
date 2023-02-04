import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ServerExceptionFilter } from 'src/services/filters/server-exception.filter';
import { HttpInterceptor } from 'src/services/interceptors/http.interceptor';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthInterceptor } from 'src/services/interceptors/auth.interceptor';

@Controller()
@UseInterceptors(HttpInterceptor)
@UseInterceptors(AuthInterceptor)
@UseFilters(ServerExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async signIn(@Body() signInUser: signInDto, @Request() req) {
    return this.authService.login(req.user);
  }
}
