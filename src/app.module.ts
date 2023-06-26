import { BadRequestException, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildTypeormConf } from './config/typeorm';
import { RequestLogger } from './common/interceptor/request.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Log } from './modules/log/entities/log.entity';
import { UserModule } from './modules/user/user.module';
import { LogModule } from './modules/log/log.module';
import { CommonModule } from './common/common.module';
import { User } from './modules/user/entities/user.entity';
import { RoleModule } from './modules/role/role.module';
import { Role } from './modules/role/entities/role.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Auth } from './modules/auth/entities/auth.entity';
import { Page } from './modules/page/entities/page.entity';
import { PageModule } from './modules/page/page.module';
import { ApisModule } from './modules/apis/apis.module';
import { UserService } from './modules/user/user.service';
import { AuthGuard } from './common/guards/auth.guard';
import { RoleService } from './modules/role/role.service';
import { AuthService } from './modules/auth/auth.service';
import { LoginModule } from './modules/login/login.module';
import { Post } from './modules/post/entities/post.entity';
import { PostContent } from './modules/post-content/entities/content.entity';
import { PostModule } from './modules/post/post.module';
import { PostContentModule } from './modules/post-content/post-content.module';
import { Tag } from './modules/tag/entities/tag.entity';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';
import { Category } from './modules/category/entities/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from './modules/file/file.module';
import { ConfigService } from './config/config.service';
import { config } from 'process';

@Module({
  imports: [
    MulterModule.register({
      dest: "../assets/images",
      limits: {
        fieldSize: 1024 * 1024 * 10
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          throw new BadRequestException("Please provide a valid picture file");
        }
        cb(null, true);
      },
    }),
    // NestJS NestGI support for TypeOrm module.
    ...buildTypeormConf([Log, User, Role, Auth, Page, Post, PostContent, Tag, Category]),
    UserModule,
    LogModule,
    CommonModule,
    RoleModule,
    AuthModule,
    PageModule,
    ApisModule,
    LoginModule,
    PostModule,
    TagModule,
    FileModule,
    CategoryModule,
    PostContentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UserService,
    RoleService,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    ConfigService,
    {
      provide: "CONF",
      useFactory: (configService: ConfigService) => configService.get(),
      inject: [ConfigService]
    }
  ],
  exports: ["CONF", ConfigService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes("*");
  }
}
