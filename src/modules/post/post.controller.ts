import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';
import { PostType, PostVisibleRange } from 'src/common/enum/common.enum';

@Controller('post')
@ApiTags("Post")
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post("add")
  @Apis({
    options: { summary: "create one new post" },
    bodys: [
      {
        type: CreatePostDto
      }
    ]
  })
  async create(@Body(ValidationPipe) createPostDto: CreatePostDto) {
    return {
      data: await this.postService.create(createPostDto)
    }
  }

  @Get("page")
  @Apis({
    options: { summary: "get all post by page" },
    querys: [
      {
        name: "visibleRange",
        required: false,
        enum: PostVisibleRange
      },
      {
        name: "type",
        required: false,
        enum: PostType
      },
      {
        name: "isDel",
        required: false,
      },
    ]
  })
  findAll(@Query("pageNum") pageNum: number,
    @Query("pageSize") pageSize: number,
    @Query("type") type: PostType,
    @Query("visibleRange") visibleRange: PostVisibleRange,
    @Query("isDel") isDel?: boolean) {
    return this.postService.findAll(+pageNum, +pageSize, visibleRange, type, !!isDel);
  }

  @Post("version")
  @Apis({
    options: { summary: "Change the version number of the post" },
    querys: [
      {
        name: "id",
        required: true,
        type: "uuid"
      },
      {
        name: "version",
        required: true,
        type: String
      }
    ]
  })
  async hanldeVersion(@Query("id") id: string, @Query("version") version: string) {
    return this.postService.changeVersion(id, version);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.postService.findOne(id)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @Patch("enable/:id")
  enable(@Param('id') id: string) {
    return this.postService.enable(id);
  }
}
