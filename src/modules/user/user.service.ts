import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, IsNull, ManyToMany, Not, Repository } from 'typeorm';
import { buildDefNickname } from 'src/utils/build-default-nickname.util';
import { _trim, _trim_around, _trim_right, isBool } from 'src/utils/string.util';
import { Message } from 'src/common/enum/common.enum';
import { PageVo } from 'src/utils/pagination.util';
import { Role } from '../role/entities/role.entity';
import { Crypto, EncryptKey } from 'src/utils/crypto.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly eManager: EntityManager
  ) { }

  async create(createUserDto: CreateUserDto) {
    const {
      userAccount,
      userPassword,
      nickName = buildDefNickname(userAccount),
    } = createUserDto;

    const _account = _trim(userAccount);
    const _pwd = Crypto.encrypt(_trim(userPassword), EncryptKey.Password); // 使用加密凭证对密码进行加密
    const _nickname = _trim(nickName);
    if (await this.userRepo.count({ where: { account: _account } }) > 0) {
      throw new ServiceUnavailableException(Message.AccountExist);
    }
    if (await this.userRepo.count({ where: { nickName: _nickname } }) > 0) {
      throw new ServiceUnavailableException(Message.NicknameExist);
    }

    return this.eManager.transaction(async (manager) => {
      let roleIds = [];
      const roles = [];
      if (Array.isArray(createUserDto.roles) && createUserDto.roles.length > 0) roleIds = createUserDto.roles;
      for await (const id of roleIds) {
        if (Array.isArray(createUserDto.roles) && createUserDto.roles.length > 0) {
          const role = await manager.getRepository(Role).findOne({ where: { id, delFlag: IsNull() } });
          roles.push(role);
        }
      }

      return await manager.getRepository(User).save({
        account: _account,
        password: _pwd,
        nickName: _nickname,
        roles
      } as CreateUserDto)
    })
  }

  async findAllByPage(pageNum: number, pageSize: number, isDel?: boolean, hasRole?: boolean) {
    const [userList, count] = await this.userRepo.findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      relations: isBool(hasRole) ? ["roles"] : undefined
    });
    return new PageVo({
      pageNum,
      pageSize,
      data: userList.map(user => {
        user.hobbies = user.hobbies ? JSON.parse(user.hobbies) : null;
        return user;
      }),
      total: count
    });
  }

  async findOneById(id: string, isDel?: boolean, hasRole?: boolean) {
    const user = await this.userRepo.findOne({ where: { id, delFlag: isDel ? Not(IsNull()) : IsNull(), }, relations: isBool(hasRole) ? ["roles"] : undefined });
    if (user.hobbies) user.hobbies = JSON.parse(user.hobbies);
    return user;
  }

  updateUserInfo(id: string, updateUserDto: UpdateUserDto) {

    return this.eManager.transaction(async (manager) => {
      let roleIds = [];
      const roles = [];
      if (Array.isArray(updateUserDto.roles) && updateUserDto.roles.length > 0) roleIds = updateUserDto.roles;
      for await (const id of roleIds) {
        const role = await manager.getRepository(Role).findOne({ where: { id, delFlag: IsNull() } });
        roles.push(role);
      }

      return await manager.getRepository(User).save({
        id,
        nickName: _trim_around(updateUserDto.nickName),
        sex: updateUserDto?.sex,
        age: updateUserDto?.age,
        avatar: _trim(updateUserDto?.avatar),
        signature: _trim_right(updateUserDto?.signature),
        hobbies: JSON?.stringify(updateUserDto?.hobbies),
        phone: _trim(updateUserDto?.phone),
        email: _trim(updateUserDto?.email),
        qq: _trim(updateUserDto?.qq),
        wechat: _trim(updateUserDto?.wechat),
        wechatQrcode: _trim(updateUserDto?.wechatQrcode),
        roles
      } as User)
    },)
  }

  disable(id: string) {
    return !!this.userRepo.update({ id }, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.userRepo.update({ id }, { delFlag: null });
  }

  async findOneByUserAccount(accounnt: string, hasRole?: boolean) {
    const _acc = _trim(accounnt);
    return await this.userRepo.findOne({
      where: {
        account: _acc,
        delFlag: IsNull()
      },
      relations: isBool(hasRole) ? ["roles"] : undefined,
      select: {
        id: true,
        nickName: true,
        sex: true,
        age: true,
        avatar: true,
        signature: true,
        hobbies: true,
        phone: true,
        email: true,
        qq: true,
        wechat: true,
        wechatQrcode: true,
        account: true,
        password: true
      }
    });
  }
}
