import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { LogModule } from 'src/modules/log/log.module';
import { RoleModule } from 'src/modules/role/role.module';
import { RoleService } from 'src/modules/role/role.service';
import { UserModule } from 'src/modules/user/user.module';
import { UserService } from 'src/modules/user/user.service';

@Module({
    imports: [
        LogModule,
    ],
    providers: [
    ]
})
export class CommonModule {}
