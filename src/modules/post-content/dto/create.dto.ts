import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Post } from "src/modules/post/entities/post.entity";

export class CreateNewPostContentCopy {
    @ApiProperty({
        description: "post content",
        required: true
    })
    @IsString({
        message: "Content Is Required" 	    //message: "Content must be a string" 	    //any message 	    //any message"
    })
    content: string;

    @ApiProperty({
        description: "post id",
        required: false
    })
    postId?: string;

}