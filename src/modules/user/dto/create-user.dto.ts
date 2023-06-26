import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Validate } from 'class-validator';
import { Valid } from 'src/common/decorators/Valid.decorator';
import { YupSchema } from 'src/utils/yup.util';
import { User } from '../entities/user.entity';

export class CreateUserDto extends User {

    @Validate(Valid, [YupSchema.ACCOUNT])
    @ApiProperty({
        description: "The userAccount must start with a uppercase letter and contain 5 to 12 letters and digits and underscores"
    })
    userAccount: string;

    @ApiProperty({
        description: "The userPassword must start with a uppercase letter and contain only letters, digits, and underscores (_)"
    })
    @Validate(Valid, [YupSchema.PASSWORD])
    userPassword: string;

    @ApiProperty({
        minLength: 2,
        maxLength: 8,
        required: false
    })
    nickName: string;
}
