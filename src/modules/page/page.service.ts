import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { EntityManager, IsNull, Not, QueryFailedError, Repository } from 'typeorm';
import { Page } from './entities/page.entity';
import { _trim, _trim_left, isBool } from 'src/utils/string.util';
import { Message, PageType } from 'src/common/enum/common.enum';
import { Auth } from '../auth/entities/auth.entity';
import { PageVo } from 'src/utils/pagination.util';

@Injectable()
export class PageService {
  constructor(
    private readonly eManager: EntityManager
  ) { }

  async create(createPageDto: CreatePageDto) {
    if (await this.eManager.getRepository(Page).count({ where: { title: _trim(createPageDto.title) } }) > 0) return new BadRequestException(Message.PageTitleExist);
    let auth = null;
    if (createPageDto.auth) auth = await this.eManager.getRepository(Auth).findOne({ where: { id: createPageDto.auth, delFlag: IsNull() } });

    if (createPageDto.type === PageType.Page) {
      if (!createPageDto.path) throw new BadRequestException(Message.PagePathRequired);
      if (!createPageDto.component) throw new BadRequestException(Message.PageComponentPathRequired);
    }

    return this.eManager.transaction(async (manager) => {
      return await manager.getRepository(Page).save({
        title: _trim(createPageDto.title),
        path: _trim(createPageDto.path),
        comments: _trim(createPageDto.component),
        sort: createPageDto.sort,
        isIframe: createPageDto.isIframe,
        type: createPageDto.type,
        isLink: createPageDto.isLink,
        visible: createPageDto.visible,
        redirect: createPageDto.redirect,
        prefixIcon: _trim(createPageDto.prefixIcon),
        suffixIcon: _trim(createPageDto.suffixIcon),
        remark: _trim_left(createPageDto.remark),
        auth
      })
    });
  }

  async findAll(pageNum: number, pageSize: number, isDel?: boolean, hasAuth?: boolean) {
    const [data, total] = await this.eManager.getRepository(Page).findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
      },
      relations: isBool(hasAuth) ? ['auth'] : [],
      take: pageSize * pageNum,
      skip: pageSize * (pageNum - 1),
      order: {
        createTime: "DESC"
      }
    })
    return new PageVo({
      pageNum,
      pageSize,
      data,
      total
    });
  }

  findOne(id: string, isDel?: boolean) {
    return this.eManager.getRepository(Page).findOne({
      where: {
        id,
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      }
    });
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    let auth = null;
    if (updatePageDto.auth) auth = await this.eManager.getRepository(Auth).findOne({ where: { id: updatePageDto.auth, delFlag: IsNull() } });

    if (updatePageDto.type === PageType.Page) {
      if (!updatePageDto.path) throw new BadRequestException(Message.PagePathRequired);
      if (!updatePageDto.component) throw new BadRequestException(Message.PageComponentPathRequired);
    }

    return this.eManager.transaction(async (manager) => {
      try {
        return await manager.getRepository(Page).save({
          id,
          title: _trim(updatePageDto.title),
          path: _trim(updatePageDto.path),
          comments: _trim(updatePageDto.component),
          sort: updatePageDto.sort,
          isIframe: updatePageDto.isIframe,
          type: updatePageDto.type,
          isLink: updatePageDto.isLink,
          visible: updatePageDto.visible,
          redirect: updatePageDto.redirect,
          prefixIcon: _trim(updatePageDto.prefixIcon),
          suffixIcon: _trim(updatePageDto.suffixIcon),
          remark: _trim_left(updatePageDto.remark),
          auth
        })
      } catch (error) {
        if (error instanceof QueryFailedError) throw new BadRequestException(`${Message.PageTitleExist}`);
      }
    });
  }

  remove(id: string) {
    return !!this.eManager.getRepository(Page).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(Page).update(id, { delFlag: null });
  }
}
