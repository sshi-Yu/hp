import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, BadRequestException } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Message } from 'src/common/enum/common.enum';
import { AuthTags } from 'src/common/decorators/AuthTag';

@Controller('role')
@ApiTags('Role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post("add")
  @Apis({
    options: { summary: "create one new role" },
    bodys: [
      {
        type: CreateRoleDto,
      }
    ]
  })
  @AuthTags("sys:role:add")
  create(@Body(ValidationPipe) createAuthDto: CreateRoleDto) {
    return this.roleService.create(createAuthDto);
  }
  @Get()
  @Apis({
    options: { summary: "find role list by page" },
    querys: [
      {
        name: "isDel",
        type: Boolean,
        required: false
      },
      {
        name: "hasAuth",
        type: Boolean,
        required: false
      }
    ]
  })
  @AuthTags("sys:role:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Query("isDel") isDel?: boolean, @Query("hasAuth") hasAuth?: boolean) {
    return {
      data: await this.roleService.findAllByPage(pageNum, pageSize, isDel, hasAuth)
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.roleService.findOne(id)
    }
  }

  @Patch(':id')
  @Apis({
    options: { summary: "update role info" },
    bodys: [{ type: UpdateRoleDto }]
  })
  @AuthTags("sys:role:update")
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    if(!id) throw new BadRequestException(Message.RequiredIdOfUpdateTarget);
    return await this.roleService.update(id, updateRoleDto);
  }

  @Delete('remove:id')
  @AuthTags("sys:role:remove")
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  @Patch("enable/:id")
  @AuthTags("sys:role:enable")
  enable(@Param('id') id: string) {
    return this.roleService.enable(id);
  }
}
