import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTagDto {
    @ApiProperty({
        description:"标签名称"
    })
    @IsString({message: "tagName is required!"})
    tagName: string;

    @ApiProperty({
        description: "标签备注"
    })
    @IsString({message: "tagRemark is required!"})
    remark: string;

    @ApiProperty({
        description: "小图标"
    })
    @IsString({message: "iconName is required!"})
    iconName: string;

    @ApiProperty({
        description: "Post ids",
        required: false
    })
    postIds: string[];
}
