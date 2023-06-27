import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsUUID, IsUrl } from "class-validator";
import { SourceType } from "src/common/enum/common.enum";

export class CreateCommentDto {

    @ApiProperty({
        maxLength: 28,
        description: "nickname",
        required: true
    })
    @IsString({ message: "Please input your nickname!" })
    nickName: string;

    @ApiProperty({
        maxLength: 128,
        description: "email",
        required: true
    })
    @IsString({ message: "Please input your email!" })
    email: string;

    @ApiProperty({
        maxLength: 128,
        description: "website address",
        required: true
    })
    @IsUrl({}, { message: "Please input your website address!" })
    website: string;

    @ApiProperty({
        maxLength: 199,
        description: "comment content",
        required: true
    })
    @IsString({ message: "Please input comment content!" })
    content: string;

    @ApiProperty({
        maxLength: 64,
        description: "id of the binding target",
    })
    @IsString({ message: "Source deficiency!" })
    source: string;

    @ApiProperty({
        type: "enum",
        enum: SourceType,
    })
    @IsEnum(SourceType, { message: "Please provide valid SourceType!" })
    sourceType: SourceType;

    @ApiProperty({
        maxLength: 64,
        description: "id of the reply target",
        required: false
    })
    replyTo: string;

    @ApiProperty({
        type: "integer",
        default: 0,
        required: false
    })
    like: number;

    @ApiProperty({
        type: "boolean",
        default: false,
        required: false
    })
    isTop: boolean;

    @ApiProperty({
        type: "boolean",
        default: true,
        required: false
    })
    allowComment: boolean;

    @ApiProperty({
        maxLength: 64,
        description: "id of the parent",
        nullable: true,
        required: false
    })
    parentId: string;

    // @ApiProperty({
    //     maxLength: 64,
    //     description: "id of the reviewer",
    // })
    // @IsUUID("all", { message: "Invalid identity, please re-verify identity!" })
    // reviewerId: string;
}
