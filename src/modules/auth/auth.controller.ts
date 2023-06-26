import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Message } from 'src/common/enum/common.enum';
import { AuthTags } from 'src/common/decorators/AuthTag';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("add")
  @Apis({
    options: { summary: "create one new auth" },
    bodys: [
      {
        type: CreateAuthDto,
      }
    ]
  })
  @AuthTags("sys:auth:add")
  async create(@Body(ValidationPipe) createAuthDto: CreateAuthDto) {

    return await this.authService.create(createAuthDto)
  }

  @Get("page")
  @Apis({
    options: { summary: "find auth by page" },
    querys: [{
      name: "isDel",
      type: Boolean,
      required: false
    }]
  })
  @AuthTags("sys:auth:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Query("isDel") isDel?: boolean) {
    return {
      data: await this.authService.findAllByPage(pageNum, pageSize, isDel)
    }
  }

  @Get(':id')
  @AuthTags("sys:auth:one")
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @Apis({
    options: { summary: "update auth info" },
    bodys: [{
      type: UpdateAuthDto
    }]
  })
  @AuthTags("sys:auth:update")
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    if(!id) throw new BadRequestException(Message.RequiredIdOfUpdateTarget);
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('remove:id')
  @AuthTags("sys:auth:remove")
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }

  @Patch("enable/:id")
  @AuthTags("sys:auth:enable")
  enable(@Param('id') id: string) {
    return this.authService.enable(id);
  }
}
