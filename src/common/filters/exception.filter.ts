import { LogService } from 'src/modules/log/log.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from 'express';
import { CreateLogDto } from 'src/modules/log/dto/create-log.dto';
import { getIp, getLocation } from 'src/utils/ip.util';
import { getBrowser, getEquipment, getOS } from 'src/utils/user-agent.util';
import { HandleRes } from '../enum/http-method.enum';
import { Message } from '../enum/common.enum';
import { HttpStatusCode } from '../enum/http-code.enum';

@Catch()
export class GlobalException implements ExceptionFilter {
    private readonly logger = new Logger(GlobalException.name);

    constructor(private readonly logService: LogService) { }

    catch(exception: Error & {
        response?: any,
        status?: HttpStatusCode
    }, host: ArgumentsHost) {
        const ctx = host.switchToHttp();    // Get the HttpContext of the request that generated the exception.
        const req = ctx.getRequest();
        const responseHandler = ctx.getResponse<Response>();

        const ip = getIp(req);
        const _l = getLocation(ip.ipv4); // {city_name: '', country_name: '', region_name: ''}

        const location = _l["country_name"] + " - " + _l["region_name"] + " - " + _l["city_name"];

        const _url = req.url;
        const _method = req.method;

        const _os = getOS(req);
        const _eq = getEquipment(req);
        const _borwser = getBrowser(req);

        const _handler = "";

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
            type: HandleRes.Error,
            resp: JSON.stringify(exception)
        } as CreateLogDto)

        this.logService.create(createLogDto);
        this.logger.error(exception);
        const { response, status } = exception;

        if (exception instanceof HttpException) {
            responseHandler.status(status).json({
                code: status,
                message: response ? response.message ? response.message : response : Message.ServerError
            });
        } else {
            responseHandler.json(
                {
                    code: 99,
                    message: response ? response.message ? response.message : response : Message.ServerError
                }
            )
        }

    }
}