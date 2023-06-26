import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Apis({
    options: { summary: "create one new category" },
    bodys: [
      {
        type: CreateCategoryDto
      }
    ]
  })
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return !!this.categoryService.create(createCategoryDto);
  }

  @Get("page")
  @Apis({
    options: { summary: "find all category by page" },
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
      data: await this.categoryService.findAll(pageNum, pageSize, isDel, hasPost)
    }
  }

  @Get(':id')
  @Apis({
    options: { summary: "find one category by id" },
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
      data: await this.categoryService.findOne(id, isDel, hasPost)
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Patch("enable/:id")
  enable(@Param('id') id: string) {
    return this.categoryService.enable(id);
  }
}
