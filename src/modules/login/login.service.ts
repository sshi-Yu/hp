import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'src/common/enum/http-code.enum';
import { UserService } from 'src/modules/user/user.service';
import { Crypto, EncryptKey } from 'src/utils/crypto.util';
import { JWT } from 'src/utils/jwt.util';
import { _trim } from 'src/utils/string.util';
import { Yup, YupSchema } from 'src/utils/yup.util';

export interface LoginResp {
  success: boolean,
  message: string,
  accessToken?: string,
  refreshToken?: string,
  userInfo?: object
}

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserService
  ) { }

  async login(account: string, password: string): Promise<LoginResp> {
    const _acc = _trim(account);
    const _pwd = _trim(password);
    Yup.valid(Yup.getSchema(YupSchema.ACCOUNT), _acc);
    Yup.valid(Yup.getSchema(YupSchema.PASSWORD), _pwd);

    const user = await this.userService.findOneByUserAccount(_acc, true);
    if (!user) throw new BadRequestException("The user name or password is incorrect");
    if (!Crypto.compare(_pwd, user.password, EncryptKey.Password)) throw new BadRequestException("The user name or password is incorrect");
    const accessToken = JWT.encode({ userId: user.id });
    const refreshToken = JWT.encode({ userId: user.id }, 60 * 60 * 24); // refreshToken 有效期24h
    const userInfo = { ...user };
    delete userInfo.password;
    return {
      success: true,
      message: 'Logged in successfully',
      accessToken,
      refreshToken,
      userInfo
    }
  }

  async refreshToken(token: string) {
    // checking token validity
    JWT.verify(token);

    // checking user status
    const tokenInfo = JWT.decodePayload<{ payload: { userId: string } }>(token);
    const userId = tokenInfo.payload.userId;
    const user = await this.userService.findOneById(userId);
    if (!user) throw new HttpException({
      message: "Invalid User"
    }, HttpStatusCode.Forbidden);

    // refresh
    const _acc = JWT.encode({ userId });
    const _ref = JWT.encode({ userId });
    return {
      _acc,
      _ref
    }
  }

}
