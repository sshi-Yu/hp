import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { _trim, _trim_left, isBool } from 'src/utils/string.util';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Not, QueryFailedError, Repository } from 'typeorm';
import { Message } from 'src/common/enum/common.enum';
import { PageVo } from 'src/utils/pagination.util';
import { Auth } from '../auth/entities/auth.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly eManager: EntityManager
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const _roleName = _trim(createRoleDto.roleName);
    const _roleKey = _trim(createRoleDto.roleKey);
    const _remark = _trim_left(createRoleDto.remark);
    if (await this.roleRepo.count({ where: { roleName: _roleName } }) > 0) throw new BadRequestException(Message.RoleNameExist);
    if (await this.roleRepo.count({ where: { roleKey: _roleKey } }) > 0) throw new BadRequestException(Message.RoleKeyExist);

    return this.eManager.transaction(async (manager) => {
      const authList = [];
      let authIds = [];
      if (Array.isArray(createRoleDto.auths) && createRoleDto.auths.length > 0) authIds = createRoleDto.auths;

      for await (const id of authIds) {
        const auth = await manager.getRepository(Auth).findOne({ where: { id, delFlag: IsNull() } });
        authList.push(auth);
      }

      return await this.roleRepo.save({
        roleName: _roleName,
        roleKey: _roleKey,
        remark: _remark,
        auths: authList
      });
    })
  }

  async findAllByPage(pageNum: number, pageSize: number, isDel?: boolean, hasAuth?: boolean) {
    const [data, count] = await this.roleRepo.findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: isBool(hasAuth) ? ["auths"] : undefined
    })
    return new PageVo({
      pageNum,
      pageSize,
      total: count,
      data
    });
  }

  findOne(id: string, isDel?: boolean) {
    return this.roleRepo.findOne({
      where: {
        id,
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull()
      }
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.eManager.transaction(async (manager) => {
      try {
        let authIds = [];
        const authList = [];
        if (Array.isArray(updateRoleDto.auths) && updateRoleDto.auths.length > 0) authIds = updateRoleDto.auths;
        for await (const id of authIds) {
          const auth = await manager.getRepository(Auth).findOne({ where: { id, delFlag: IsNull() } });
          authList.push(auth);
        }
        return await manager.getRepository(Role).save({
          id,
          roleName: _trim(updateRoleDto.roleName),
          roleKey: _trim(updateRoleDto.roleKey),
          remark: _trim_left(updateRoleDto.remark),
          auths: authList
        });
      } catch (error) {
        if (error instanceof QueryFailedError) throw new BadRequestException(`${Message.RoleNameExist} or ${Message.RoleKeyExist}`);
      }
    })
  }

  remove(id: string) {
    return !!this.roleRepo.update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.roleRepo.update(id, { delFlag: null });
  }
}
