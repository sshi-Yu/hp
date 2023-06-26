import { LogService } from 'src/modules/log/log.service';
import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { HandleRes } from 'src/common/enum/http-method.enum';
import { Apis } from 'src/common/decorators/Apis.decorator';

@Controller('log')
@ApiTags("log")
export class LogController {
    constructor(
        private readonly logService: LogService
    ) { }

    @Get("page")
    @Apis({
        options: {
            summary: 'Get all log items by page',
        },
        querys: [
            {
                name: "pageNum",
                description: "页码"
            },
            {
                name: "pageSize",
                description: "每页条数"
            }
        ]
    })
    async getLogs(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number) {
        return {
            data: await this.logService.findByPage(pageNum, pageSize)
        }
    }

    @Get("type")
    @Apis({
        options: {
            summary: "Get all log items by type",
        },
        querys: [
            {
                name: "pageNum",
                description: "页码"
            },
            {
                name: "pageSize",
                description: "每页条数"
            },
            {
                name: "type",
                description: "日志类型",
                enum: HandleRes
            }
        ]
    })
    async getLogsByType(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Query("type") type: HandleRes) {
        return {
            data: await this.logService.findByType(type, pageNum, pageSize)
        }
    }

}
