import { Module } from '@nestjs/common';
import { PostContentService } from './post-content.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostContent } from './entities/content.entity';
import { PostContentController } from './post-content.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostContent])
  ],
  providers: [PostContentService],
  controllers: [PostContentController]
})
export class PostContentModule {}
