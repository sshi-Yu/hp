import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { PostType, PostVisibleRange } from "src/common/enum/common.enum";
export class CreatePostDto {

    // 文章标题
    @IsString()
    @MinLength(3)
    @MaxLength(99)
    @ApiProperty({
        description: "title",
        minLength: 3,
        maxLength: 99,
    })
    title: string;

    // 文章类型
    @IsString()
    @ApiProperty({
        description: "type",
        type: "enum",
        enum: PostType
    })
    type: PostType;

    // 封面图
    @IsUrl({}, {
        message: "Please provide a valid url"
    })
    @ApiProperty({
        description: "cover image",
    })
    coverImage: string;

    // 文章摘要
    @IsString()
    @MaxLength(180)
    @ApiProperty({
        description: "summary",
        maxLength: 180
    })
    summary: string;

    // 可见范围
    @IsString()
    @ApiProperty({
        description: "visible range",
        type: "enum",
        enum: PostVisibleRange
    })
    visibleRange: PostVisibleRange;

    @IsString()
    @ApiProperty({
        description: "content"
    })
    content: string;

    // 文章分类
    @IsArray()
    @ApiProperty({
        description: "catgory list",
        type: "array"
    })
    category: string[];

    // 文章标签
    @IsArray()
    @ApiProperty({
        description: "tag list",
        type: "array"
    })
    tags: string[];
}
