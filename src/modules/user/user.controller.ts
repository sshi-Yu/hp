import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { AuthTags } from 'src/common/decorators/AuthTag';
import { Message } from 'src/common/enum/common.enum';

@Controller('user')
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("add")
  @Apis({
    options: {
      summary: "create one new user"
    },

    bodys: [
      {
        type: CreateUserDto
      }
    ]
  })
  @AuthTags("sys:auth:add")
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("page")
  @Apis({
    options: { summary: "find all user by page" },
    querys: [
      {
        name: "isDel",
        required: false
      },
      {
        name: "hasRole",
        required: false
      }
    ]
  })
  @AuthTags("sys:auth:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Query("isDel") isDel?: boolean, @Query("hasRole") hasRole?: boolean) {
    return await this.userService.findAllByPage(pageNum, pageSize, isDel, hasRole);
  }

  @Get(':id')
  @Apis({
    options: { summary: "find one user by id" },
    querys: [
      {
        name: "isDel",
        required: false
      },
      {
        name: "hasRole",
        required: false
      }
    ]
  })
  @AuthTags("sys:auth:one")
  async findOne(@Param('id') id: string, @Query("isDel") isDel: boolean, @Query("hasRole") hasRole: boolean) {
    return {
      data: await this.userService.findOneById(id, isDel, hasRole)
    };
  }

  @Patch('update')
  @Apis({
    options: {
      summary: "update a user with given id and user object"
    },
    querys: [
      {
        name: "id",
        description: "user id",
      }
    ],
    bodys: [
      {
        type: UpdateUserDto
      }
    ]
  })
  @AuthTags("sys:auth:update")
  async update(@Query('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    if (!id) throw new BadRequestException(Message.RequiredIdOfUpdateTarget);
    return await this.userService.updateUserInfo(id, updateUserDto);
  }

  @Delete('disable:id')
  @AuthTags("sys:auth:remove")
  async disable(@Param('id') id: string) {
    return await this.userService.disable(id);
  }

  @Patch("enable/:id")
  @AuthTags("sys:auth:enable")
  async enable(@Param('id') id: string) {
    return await this.userService.enable(id);
  }
}
