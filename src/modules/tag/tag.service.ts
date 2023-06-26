import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { EntityManager, IsNull, Not } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { _trim, isBool } from 'src/utils/string.util';
import { PageVo } from 'src/utils/pagination.util';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class TagService {

  constructor(
    private readonly eManager: EntityManager
  ) { }

  async create(createTagDto: CreateTagDto) {
    let posts = [];
    for await (const postId of createTagDto.postIds) {
      const _post = await this.eManager.getRepository(Post).findOne({ where: { id: postId } });
      if (_post) posts.push(_post);
    }

    return this.eManager.getRepository(Tag).save({
      tagName: _trim(createTagDto.tagName),
      posts: posts,
      iconName: _trim(createTagDto.iconName),
      remark: _trim(createTagDto.remark),
    } as Tag)
  }

  async findAll(pageNum: number, pageSize: number, isDel?: boolean, hasPost?: boolean) {
    const [tags, count] = await this.eManager.getRepository(Tag).findAndCount({
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
    return await this.eManager.getRepository(Tag).findOne({
      where: {
        id,
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      },
      relations: isBool(hasPost) ? ["posts"] : undefined
    })
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    return !!this.eManager.getRepository(Tag).update({ id }, {
      tagName: _trim(updateTagDto.tagName),
      iconName: _trim(updateTagDto.iconName),
      remark: _trim(updateTagDto.remark),
    })
  }

  remove(id: string) {
    return !!this.eManager.getRepository(Tag).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(Tag).update(id, { delFlag: null });
  }
}
