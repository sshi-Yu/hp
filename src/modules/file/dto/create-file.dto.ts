import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { ImageType, PostVisibleRange } from "src/common/enum/common.enum";

export class CreateFileDto {
    @ApiProperty({
        description: "file description",
        maxLength: 101
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "file visible range",
        type: "enum",
        enum: PostVisibleRange,
        default: PostVisibleRange.Public
    })
    @IsString()
    visibleRange: PostVisibleRange;

    @ApiProperty({
        description: "file type",
        type: "enum",
        enum: ImageType,
        default: ImageType.Illustration
    })
    @IsString()
    type: ImageType;
}
