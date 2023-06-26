import { LogService } from '../../modules/log/log.service';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from 'rxjs';
import { CreateLogDto } from 'src/modules/log/dto/create-log.dto';
import { getIp, getLocation } from "src/utils/ip.util";
import { getBrowser, getEquipment, getOS } from "src/utils/user-agent.util";
import { HandleRes } from '../enum/http-method.enum';

@Injectable()
export class RequestLogger implements NestInterceptor {

    constructor(private readonly logService: LogService) { }

    intercept(ctx: ExecutionContext, next: CallHandler) {
        const req = ctx.switchToHttp().getRequest();
        const ip = getIp(req);
        const _l = getLocation(ip.ipv4); // {city_name: '', country_name: '', region_name: ''}

        const location = _l["country_name"] + " - " + _l["region_name"] + " - " + _l["city_name"];

        const _url = req.url;
        const _method = req.method;

        const _os = getOS(req);
        const _eq = getEquipment(req);
        const _borwser = getBrowser(req);

        const _handler = ctx.getClass().name + "." + ctx.getHandler().name;
        return next
            .handle()
            .pipe(
                map(({ data, message, packing = true }) => { // packing指示是否对返回结果进行包装默认为true
                    const createLogDto = new CreateLogDto();
                    Object.assign(createLogDto, {
                        equipment: _eq,
                        os: _os,
                        browser: _borwser,
                        hander: _handler,
                        ip: ip.ipv4,
                        method: _method,
                        params: JSON.stringify(req.params),
                        url: _url,
                        location: location,
                        type: HandleRes.Message,
                        // resp: JSON.stringify(data)
                    } as CreateLogDto)

                    this.logService.create(createLogDto);
                    if (packing) {
                        return {
                            code: 0,
                            message: message || "success",
                            data
                        }
                    } else {
                        return data;
                    }
                })
            )
    }
}