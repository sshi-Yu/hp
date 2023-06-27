import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, ValidationPipe } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { FriendStatusCode, Message } from 'src/common/enum/common.enum';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('friend')
@ApiTags("Friend")
export class FriendController {
  constructor(private readonly friendService: FriendService) { }

  @Post()
  create(@Body(ValidationPipe) createFriendDto: CreateFriendDto) {
    return this.friendService.create(createFriendDto);
  }

  @Get("page")
  @Apis({
    options: { summary: "find files by page" },
    querys: [{
      name: "isDel",
      type: Boolean,
      required: false
    }, {
      name: "status",
      type: "enum",
      enum: FriendStatusCode,
      required: true
    }]
  })
  // @AuthTags("sys:friend:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number,
    @Query("isDel") isDel?: boolean, @Query("status") status?: FriendStatusCode,) {
    return {
      data: await this.friendService.findAll(+pageNum, +pageSize, status, isDel)
    }
  }

  @Get('one')
  @Apis({
    options: { description: "find one friend by some conditions" },
    querys: [
      {
        name: "id",
        type: String,
        required: false
      },
      {
        name: "url",
        type: String,
        required: false
      },
      {
        name: "master",
        type: String,
        required: false
      },
      {
        name: "isDel",
        type: Boolean,
        required: false
      },
    ]
  })
  async findOne(@Query('id') id: string, @Query("url") url: string, @Query("master") master: string, @Query("isDel") isDel: boolean) {
    return {
      data: this.friendService.findOne(id, master, url, isDel)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    if (!id) throw new BadRequestException(Message.RequiredIdOfUpdateTarget);
    return this.friendService.update(id, updateFriendDto);
  }

  @Delete('remove:id')
  // @AuthTags("sys:friend:remove")
  remove(@Param('id') id: string) {
    return this.friendService.remove(id);
  }

  @Patch("enable/:id")
  // @AuthTags("sys:friend:enable")
  enable(@Param('id') id: string) {
    return this.friendService.enable(id);
  }
}
