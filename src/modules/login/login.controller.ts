import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, HttpException } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'src/common/enum/http-code.enum';

@Controller('login')
@ApiTags("Login")
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  @Post()
  async create(@Query("userAccount") account: string, @Query("userPassword") password: string) {
    const _resp = await this.loginService.login(account, password);
    return {
      message: _resp.message,
      data: {
        accessToken: _resp.accessToken,
        refreshToken: _resp.refreshToken,
        userInfo: _resp.userInfo
      }
    }
  }

  @Post("refresh")
  async refresh(@Req() request: Request) {
    const refreshToken = request.headers["refresh-token"];
    // no token
    if (!refreshToken) throw new HttpException({
      message: "Invalid authentication. Please log in again!"
    }, HttpStatusCode.Unauthorized);

    const _resp = await this.loginService.refreshToken(refreshToken);
    return {
      message: "refresh token successfully",
      data: {
        accessToken: _resp._acc,
        refreshToken: _resp._ref
      }
    }
  }

}
