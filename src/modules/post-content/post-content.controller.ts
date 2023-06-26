import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { PostContentService } from './post-content.service';
import { CreateNewPostContentCopy } from './dto/create.dto';

@Controller('post-content')
@ApiTags("Post-Content")
export class PostContentController {
    constructor(
        private readonly postContentService: PostContentService
    ) { }

    @Post("update")
    @Apis({
        options: { summary: "update post content" },
        querys: [
            {
                name: "id",
                description: "The id of the post content",
            }
        ],
        bodys: [
            { type: CreateNewPostContentCopy }
        ]
    })
    async update(@Body(ValidationPipe) createNewPostContentCopy: CreateNewPostContentCopy, @Query("id") id: string) {
        return {
            data: await this.postContentService.update(id, createNewPostContentCopy.content, createNewPostContentCopy.postId)
        }
    }

    @Post("draft")
    @Apis({
        options: { summary: "create one new draft" },
        querys: [{ name: "postId", type: String, required: false }],
        bodys: [{ type: CreateNewPostContentCopy }]
    })
    async createDraft(@Body(ValidationPipe) createNewPostContentCopy: CreateNewPostContentCopy, @Query("postId") postId: string) {
        return {
            data: await this.postContentService.createDraft(createNewPostContentCopy, postId)
        }
    }
}
