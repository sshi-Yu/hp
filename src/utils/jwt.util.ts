import { BadRequestException, HttpException } from '@nestjs/common';
import { JwtService as JWTS } from '@nestjs/jwt';
import { HttpStatusCode } from 'src/common/enum/http-code.enum';

export class JWT {
    static readonly _secret = "__Yhsn_9j2v$ka_122zxz";
    static readonly _algorithm = "HS256";
    static readonly _type = "JWT";
    static readonly _expires = 60 * 60 * 4; // expires有效期的单位为s

    static readonly jwtService = new JWTS();

    constructor(
    ) { }

    static encode(payload: unknown, expires: number = this._expires) {
        return this.jwtService.sign({
            payload
        }, { secret: this._secret, expiresIn: expires });
    }

    static verify<T>(token: string): T & { algorithm: string, type: string } {
        const _token = JWT.decodePayload(token) as { [key: string]: any }; // decode token and return payload as a structure. 
        if (typeof _token !== "string") {
            if (_token?.header?.alg !== this._algorithm || _token?.header?.typ !== this._type) throw new BadRequestException('Invalid authentication！Illegal access！');
        }

        try {
            return this.jwtService.verify(token, { secret: this._secret }).payload;
        } catch (error) {
            throw new HttpException({
                message: "Invalid token signature or authentication has expired"
            }, HttpStatusCode.Unauthorized);
        }
    }

    static decodePayload<T>(token: string): T {
        try {
            return this.jwtService.decode(token, { complete: true }) as T;
        } catch (error) {
            throw new HttpException({
                message: "Invalid token signature"
            }, HttpStatusCode.Unauthorized);
        }
    }
}