import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('tag')
@ApiTags("Tag")
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post()
  @Apis({
    options: { summary: "create one new tag" },
    bodys: [
      {
        type: CreateTagDto
      }
    ]
  })
  async create(@Body(ValidationPipe) createTagDto: CreateTagDto) {
    return !!this.tagService.create(createTagDto);
  }

  @Get("page")
  @Apis({
    options: { summary: "find all tag by page" },
    querys: [
      {
        name: "isDel",
        required: false
      },
      {
        name: "hasPost",
        required: false
      }
    ]
  })
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Query("isDel") isDel?: boolean, @Query("hasPost") hasPost?: boolean) {
    return {
      data: await this.tagService.findAll(pageNum, pageSize, isDel, hasPost)
    }
  }

  @Get(':id')
  @Apis({
    options: { summary: "find one tag by id" },
    querys: [
      {
        name: "isDel",
        required: false
      },
      {
        name: "hasPost",
        required: false
      }
    ]
  })
  async findOne(@Param('id') id: string, @Query("isDel") isDel: boolean, @Query("hasPost") hasPost: boolean) {
    return {
      data: await this.tagService.findOne(id, isDel, hasPost)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }

  @Patch("enable/:id")
  enable(@Param('id') id: string) {
    return this.tagService.enable(id);
  }
}
