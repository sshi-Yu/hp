import { BadRequestException, CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { REQUEST, Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "src/modules/auth/auth.service";
import { RoleService } from "src/modules/role/role.service";
import { UserService } from "src/modules/user/user.service";
import { JWT } from "src/utils/jwt.util";
import { HttpStatusCode } from "../enum/http-code.enum";
import { Conf } from "src/config/config.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        @Inject("CONF")
        private readonly conf: Conf
    ) { };

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        // 通过反射器获取控制器的权限标识 
        const requiredAuthTags: string[] | undefined = this.reflector.get<string[]>("authTags", context.getHandler());
        if (!requiredAuthTags) return true;

        const req = context.switchToHttp().getRequest() as Request;

        const accessToken = req?.headers["access-token"];
        if (accessToken) {
            let tokenInfo = null;

            tokenInfo = JWT.verify<{ userId: string }>(accessToken);

            if (tokenInfo.userId) req["userId"] = tokenInfo.userId;
            // find userinfo by userid
            const user = await this.userService.findOneById(tokenInfo.userId, false, true);
            if (!user) throw new HttpException({
                message: "Invalid Operation"
            }, HttpStatusCode.NotAcceptable);;
            // Determine whether the user is the super administrator 
            const hasRoleIdList = []; // List of roles owned by the user
            for (const role of user.roles) {
                // if the user has the default super-admin-tag then allow access to the rest of the operations.
                if (role.roleKey === this.conf.role.superAdmin.rolekey) return true;

                hasRoleIdList.push(role.id);
            }

            const requiredRoleIdList = []; // List of role ids that have the permissions required to access the interface
            for await (const authKey of requiredAuthTags) {
                const auth = await this.authService.findOne(undefined, authKey, false, true);
                if (auth && Array.isArray(auth.roles) && auth.roles.length > 0) requiredRoleIdList.push(...auth?.roles.map(role => role.id));
            }
            // Compare the same item
            if (this.findDuplicates(requiredRoleIdList, hasRoleIdList)) return true;
            else throw new HttpException({
                message: "No Access!"
            }, HttpStatusCode.NotAcceptable);

        } else {
            throw new HttpException({
                message: "Invalid Operation"
            }, HttpStatusCode.Unauthorized);;
        }

    }

    findDuplicates(arr1, arr2) {
        // init hash table
        const hashTable = new Map();
        for (let i = 0; i < arr1.length; i++) {
            if (!hashTable.has(arr1[i])) {
                hashTable.set(arr1[i], true);
            }
        }

        // compare
        for (let i = 0; i < arr2.length; i++) {
            if (hashTable.has(arr2[i])) {
                return true;
            }
        }

        return false;
    }
}