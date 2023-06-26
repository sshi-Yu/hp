import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { Valid } from "src/common/decorators/Valid.decorator";
import { Sex } from "src/common/enum/common.enum";
import { YupSchema } from "src/utils/yup.util";

export class UpdateUserDto {

    @ApiProperty({
        minLength: 2,
        maxLength: 8
    })
    @MinLength(2)
    @MaxLength(8)
    nickName: string;

    @ApiProperty({
        enum: Sex,
        description: `
            {
                Unknown = 0,
                Man = 1,
                Woman = 2
            }
        `,
        default: Sex.Unknown
    })
    @IsInt()
    sex?: Sex;

    @ApiProperty()
    @IsInt()
    age?: number;

    @ApiProperty()
    avatar?: string;

    @ApiProperty({
        minLength: 16,
        maxLength: 99
    })
    @Validate(Valid, [YupSchema.SIGNATURE])
    signature: string;

    @ApiProperty({
        description: "['a', 'b']"
    })
    hobbies?: string[];

    @ApiProperty({
        description: "phone number",
        required: false
    })
    @Validate(Valid, [YupSchema.PHONE])
    phone?: string;

    @ApiProperty({
        description: "email"
    })
    @Validate(Valid, [YupSchema.EMAIL])
    email?: string;

    @ApiProperty({
        description: "qq Code"
    })
    @Validate(Valid, [YupSchema.QQ])
    qq?: string;

    @ApiProperty({
        description: "wechat Code"
    })
    wechat?: string;

    @ApiProperty({
        description: "An online wechat qrcode image url is available"
    })
    wechatQrcode?: string;

    @ApiProperty({
        description: "role id list"
    })
    roles: string[];
}
