import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, BadRequestException } from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Message } from 'src/common/enum/common.enum';
import { AuthTags } from 'src/common/decorators/AuthTag';

@Controller('page')
@ApiTags("Page")
export class PageController {
  constructor(private readonly pageService: PageService) { }

  @Post()
  @Apis({
    options: { summary: "create one new page" },
    bodys: [{
      type: CreatePageDto
    }]
  })
  @AuthTags("sys:page:add")
  create(@Body(ValidationPipe) createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get("page")
  @Apis({
    options: { summary: "find page list by page" },
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
  @AuthTags("sys:page:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Query("isDel") isDel?: boolean, @Query("hasAuth") hasAuth?: boolean) {
    return {
      data: await this.pageService.findAll(pageNum, pageSize, isDel, hasAuth)
    }
  }

  @Get(':id')
  @AuthTags("sys:page:one")
  async findOne(@Param('id') id: string) {
    return {
      data: await this.pageService.findOne(id)
    }
  }

  @Patch(':id')
  @AuthTags("sys:page:update")
  update(@Param('id') id: string, @Body(ValidationPipe) updatePageDto: UpdatePageDto) {
    if(!id) throw new BadRequestException(Message.RequiredIdOfUpdateTarget);
    return this.pageService.update(id, updatePageDto);
  }

  @Delete('remove:id')
  @AuthTags("sys:page:remove")
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }

  @Patch("enable/:id")
  @AuthTags("sys:page:enable")
  enable(@Param('id') id: string) {
    return this.pageService.enable(id);
  }
}
