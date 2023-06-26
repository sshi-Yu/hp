import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { getIp } from "src/utils/ip.util";

export const IpAddress = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        return getIp(ctx.switchToHttp().getRequest());
    }
)