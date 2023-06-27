import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('comment')
@ApiTags("Comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @Apis({
    options: { description: "create one new comment" },
    bodys: [
      { type: CreateCommentDto }
    ]
  })
  create(@Body(ValidationPipe) createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }


  @Get("page")
  @Apis({
    options: { summary: "find comment by page" },
    querys: [{
      name: "isDel",
      type: Boolean,
      required: false
    }, {
      name: "hasReplies",
      type: Boolean,
      required: false
    },
    {
      name: "hasChildren",
      type: Boolean,
      required: false
    },],
    bodys: [{ type: CreateCommentDto }]
  })
  // @AuthTags("sys:comment:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number, @Body() comment: CreateCommentDto,
    @Query("isDel") isDel?: boolean, @Query("hasReplies") hasReplies?: boolean, @Query("hasChildren") hasChildren?: boolean,) {
    return {
      data: await this.commentService.findAll(+pageNum, +pageSize, comment, isDel, hasReplies, hasChildren)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete('remove:id')
  // @AuthTags("sys:comment:remove")
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }

  @Patch("enable/:id")
  // @AuthTags("sys:comment:enable")
  enable(@Param('id') id: string) {
    return this.commentService.enable(id);
  }
}
