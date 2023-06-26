import { Controller, Get } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('apis')
@ApiTags("Apis")
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @Get("json")
  getApiJson(){
    const json = require("../../../swagger.json");
    return {
      data: json,
      packing: false
    }
  }
}
