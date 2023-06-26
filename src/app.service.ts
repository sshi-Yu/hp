import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './modules/user/entities/user.entity';
import { Role } from './modules/role/entities/role.entity';
import { UserService } from './modules/user/user.service';
import { CreateUserDto } from './modules/user/dto/create-user.dto';
import { RoleService } from './modules/role/role.service';
import { CreateRoleDto } from './modules/role/dto/create-role.dto';
import { Crypto } from './utils/crypto.util';
import { EncryptKey } from './utils/crypto.util';
import { Conf } from './config/config.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private logger = new Logger(AppService.name);

  constructor(
    private readonly eManager: EntityManager,
    @Inject("CONF")
    private readonly conf: Conf
  ) { }

  async onApplicationBootstrap(){
    this.initSystem();
  }

  // init system 
  async initSystem() {
    // Check whether the super administrator role exists in the system
    const role = await this.eManager.getRepository(Role).findOne({
      where: {
        roleKey: this.conf.role.superAdmin.rolekey
      },
      relations: ["users"]
    })
    this.eManager.transaction(async (manager) => {
      if (role) {
        if (role.users.length > 0) return;
        else {
          await this.createSuperAdminUser(manager, role);
          this.logger.debug("Description Adding a new user and assigning the super administrator role succeeded.");
        }
      } else {
        const newRole = await this.createSuperAdminRole(manager);
        this.logger.debug("Adding the super administrator succeeds.");
        await this.createSuperAdminUser(manager, newRole);
        this.logger.debug("Description Adding a new user and assigning the super administrator role succeeded.");
      }
    })

  }

  async createSuperAdminUser(manager: EntityManager, role: Role) { 
    return await manager.getRepository(User).save({
      nickName: this.conf.user.superAdmin.nickname,
      account: this.conf.user.superAdmin.account,
      password: Crypto.encrypt(this.conf.user.superAdmin.password, EncryptKey.Password),
      roles: [role]
    } as CreateUserDto);
  }

  async createSuperAdminRole(manager: EntityManager) {
    return await manager.getRepository(Role).save({
      roleName: this.conf.role.superAdmin.rolename,
      roleKey: this.conf.role.superAdmin.rolekey,
      remark: this.conf.role.superAdmin.remark
    } as Role)
  }
}
