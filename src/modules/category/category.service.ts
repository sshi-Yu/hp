import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { _trim, isBool } from 'src/utils/string.util';
import { EntityManager, IsNull, Not } from 'typeorm';
import { Category } from './entities/category.entity';
import { PageVo } from 'src/utils/pagination.util';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly eManager: EntityManager
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let posts = [];
    for await (const postId of createCategoryDto.postIds) {
      const _post = await this.eManager.getRepository(Post).findOne({ where: { id: postId } });
      if (_post) posts.push(_post); 
    }

    return this.eManager.getRepository(Category).save({
      categoryName: _trim(createCategoryDto.categoryName),
      posts: posts,
      iconName: _trim(createCategoryDto.iconName),
      remark: _trim(createCategoryDto.remark),
    } as Category)
  }

  async findAll(pageNum: number, pageSize: number, isDel?: boolean, hasPost?: boolean) {
    const [tags, count] = await this.eManager.getRepository(Category).findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      },
      skip: pageSize * (pageNum - 1),
      take: pageSize,
      relations: isBool(hasPost) ? ["posts"] : undefined
    });
    return new PageVo({
      pageNum,
      pageSize,
      total: count,
      data: tags
    })
  }

  async findOne(id: string, isDel?: boolean, hasPost?: boolean) {
    return await this.eManager.getRepository(Category).findOne({
      where: {
        id,
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      },
      relations: isBool(hasPost) ? ["posts"] : undefined
    })
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return !!this.eManager.getRepository(Category).update({ id }, {
      categoryName: _trim(updateCategoryDto.categoryName),
      iconName: _trim(updateCategoryDto.iconName),
      remark: _trim(updateCategoryDto.remark),
    })
  }

  remove(id: string) {
    return !!this.eManager.getRepository(Category).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(Category).update(id, { delFlag: null });
  }
}
