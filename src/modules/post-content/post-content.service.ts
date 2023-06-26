import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PostContent } from './entities/content.entity';
import { Post } from '../post/entities/post.entity';
import { generateVersionNum } from 'src/utils/version.util';
import { CreateNewPostContentCopy } from './dto/create.dto';

@Injectable()
export class PostContentService {
    constructor(
        @InjectRepository(PostContent)
        private readonly postContentRepo: Repository<PostContent>,
        private readonly eManager: EntityManager
    ) { }

    async createDraft(createNewPostContentCopy: CreateNewPostContentCopy, postId: string) {
        let post = null;
        if (postId) post = await this.eManager.getRepository(Post).findOne({ where: { id: postId } });

        return this.postContentRepo.save({
            content: createNewPostContentCopy.content,
            version: generateVersionNum(),
            post
        } as PostContent);
    }

    async update(contentId: string, content: string, postId: string) {
        let post = null;
        if (postId) post = await this.eManager.getRepository(Post).findOne({ where: { id: postId } });

        return this.postContentRepo.update({ id: contentId }, {
            content,
            post
        },)
    }

}
