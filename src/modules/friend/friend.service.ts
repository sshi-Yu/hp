import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { EntityManager, IsNull, Like, Not } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { _trim_around, isBool } from 'src/utils/string.util';
import { FriendStatusCode } from 'src/common/enum/common.enum';
import { PageVo } from 'src/utils/pagination.util';

@Injectable()
export class FriendService {

  constructor(
    private readonly eManager: EntityManager
  ) { }

  async create(createFriendDto: CreateFriendDto) {
    return this.eManager.getRepository(Friend).save({
      name: _trim_around(createFriendDto.name),
      master: _trim_around(createFriendDto.master),
      status: createFriendDto.status ?? FriendStatusCode.Pending,
      avatar: _trim_around(createFriendDto.avatar),
      url: _trim_around(createFriendDto.url),
      description: _trim_around(createFriendDto.description)
    } as Friend)
  }

  async findAll(pageNum: number, pageSize: number, status: FriendStatusCode = FriendStatusCode.Fulfilled, isDel?: boolean,) {
    const [data, count] = await this.eManager.getRepository(Friend).findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
        status,
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: {
        createTime: "DESC"
      }
    })
    return new PageVo({
      pageNum, pageSize, total: count, data
    });
  }

  findOne(id?: string, master?: string, url?: string, isDel?: boolean) {
    return this.eManager.getRepository(Friend).findOne({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
        id,
        master: Like(`%${_trim_around(master)}%`),
        url: Like(`%${_trim_around(url)}%`),
      },
    });
  }

  update(id: string, updateFriendDto: UpdateFriendDto) {
    return this.eManager.getRepository(Friend).update({
      name: _trim_around(updateFriendDto.name),
      master: _trim_around(updateFriendDto.master),
      status: updateFriendDto.status ?? FriendStatusCode.Pending,
      avatar: _trim_around(updateFriendDto.avatar),
      url: _trim_around(updateFriendDto.url),
      description: _trim_around(updateFriendDto.description)
    } as Friend, { id })
  }

  remove(id: string) {
    return !!this.eManager.getRepository(Friend).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(Friend).update(id, { delFlag: null });
  }
}
