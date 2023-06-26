import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth } from './entities/auth.entity';
import { _trim, _trim_left, isBool } from 'src/utils/string.util';
import { EntityManager, IsNull, Not, QueryFailedError, Repository, Transaction } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { PageVo } from 'src/utils/pagination.util';
import { Message } from 'src/common/enum/common.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
    private readonly eManager: EntityManager
  ) { }

  async create(createAuthDto: CreateAuthDto) {
    const _authName = _trim(createAuthDto.authName);
    const _authKey = _trim(createAuthDto.authKey);
    const _remark = _trim_left(createAuthDto.remark);
    const _path = _trim(createAuthDto.path);
    if (await this.authRepo.count({ where: { authName: _authName } }) > 0) throw new BadRequestException(Message.AuthNameExist);
    if (await this.authRepo.count({ where: { authKey: _authKey } }) > 0) throw new BadRequestException(Message.AuthKeyExist);

    return this.eManager.transaction(async (manager) => {
      let roleIds = [];
      const roleList = [];
      if (Array.isArray(createAuthDto.roles) && createAuthDto.roles.length > 0) roleIds = createAuthDto.roles;

      for await (const id of roleIds) {
        const role = await manager.getRepository(Role).findOne({ where: { id, delFlag: IsNull() } })
        roleList.push(role);
      }
      return await manager.getRepository(Auth).save({
        authName: _authName,
        authKey: _authKey,
        remark: _remark,
        path: _path,
        roles: roleList
      } as CreateAuthDto)
    })

  }

  async findAllByPage(pageNum: number, pageSize: number, isDel?: boolean) {
    const [data, count] = await this.authRepo.findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
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

  findOne(id?: string, authKey?: string, isDel?: boolean, hasRole?: boolean) {
    return this.authRepo.findOne({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
        id,
        authKey
      },
      relations: isBool(hasRole) ? ["roles"] : undefined
    });
  }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    const _authName = _trim(updateAuthDto.authName);
    const _authKey = _trim(updateAuthDto.authKey);
    const _remark = _trim_left(updateAuthDto.remark);
    const _path = _trim(updateAuthDto.path);
    let _roleIds = [];
    const roleList = [];
    if (Array.isArray(updateAuthDto.roles) && updateAuthDto.roles.length > 0) _roleIds = updateAuthDto.roles;

    // 为auth设置role时，被认为是给该auth追加新的role，而非覆盖式的替换
    // 获取原有的roles
    const auth = await this.findOne(id);
    if (!auth) throw new BadRequestException("The permission does not exist or has been disabled");
    const existingRoles = auth.roles;

    return this.eManager.transaction(async (manager) => {
      for await (const id of _roleIds) {
        const role = await manager.getRepository(Role).findOne({ where: { id, delFlag: IsNull() } });
        roleList.push(role);
      }

      try {
        return await manager.getRepository(Auth).save({
          id,
          authName: _authName,
          authKey: _authKey,
          remark: _remark,
          path: _path,
          roles: roleList.concat(existingRoles)
        } as UpdateAuthDto)
      } catch (error) {
        if (error instanceof QueryFailedError) throw new BadRequestException(`${Message.AuthNameExist} or ${Message.AuthKeyExist}`);
      }
    });
  }

  remove(id: string) {
    return !!this.authRepo.update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.authRepo.update(id, { delFlag: null });
  }
}
