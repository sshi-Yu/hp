import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { PageType, StatusCode } from 'src/common/enum/common.enum';

export class UpdatePageDto {
    @ApiProperty({
        description: "page title",
        minLength: 2,
        maxLength: 20
    })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    title: string;

    @ApiProperty({
        description: "page path",
        minLength: 4,
        maxLength: 45
    })
    path: string;

    @ApiProperty({
        description: "page sort order",
        minimum: 0,
        maximum: 999
    })
    @IsInt()
    @Min(0)
    @Max(999)
    sort: number;

    @ApiProperty({
        description: "component path",
        minLength: 4,
        maxLength: 45
    })
    component: string;

    @ApiProperty({
        description: "is it iframe",
        default: StatusCode.No,
        type: "enum",
        enum: StatusCode
    })
    isIframe: StatusCode;

    @ApiProperty({
        description: "page type",
        default: PageType.Page,
        type: "enum",
        enum: PageType
    })
    type: PageType;

    @ApiProperty({
        description: "is it external link",
        default: StatusCode.No,
        type: "enum",
        enum: StatusCode
    })
    isLink: StatusCode;

    @ApiProperty({
        description: "visible",
        default: StatusCode.Yes,
        type: "enum",
        enum: StatusCode
    })
    visible: StatusCode;

    @ApiProperty({
        description: "redirect path",
        minLength: 4,
        maxLength: 45
    })
    redirect: string;

    @ApiProperty({
        description: "prefix icon",
        minLength: 4,
        maxLength: 20
    })
    prefixIcon: string;

    @ApiProperty({
        description: "suffix icon",
        minLength: 4,
        maxLength: 20
    })
    suffixIcon: string;

    @ApiProperty({
        description: "remark",
        minLength: 4,
        maxLength: 50
    })
    remark: string;

    @ApiProperty({
        description: "auth id",
    })
    @IsString()
    auth: string;
}
