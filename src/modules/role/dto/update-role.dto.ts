import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateRoleDto {
    @ApiProperty({
        description: "role name",
        minLength: 2,
        maxLength: 6
    })
    @IsString()
    @MinLength(2)
    @MaxLength(6)
    roleName: string;

    @ApiProperty({
        description: "role key",
        minLength: 4,
        maxLength: 8
    })
    @IsString()
    @MinLength(6)
    @MaxLength(12)
    roleKey: string;

    @ApiProperty({
        description: "remark",
        maxLength: 99
    })
    @IsString()
    @MaxLength(99)
    remark: string;

    @ApiProperty({
        description: "auth list",
        type: Array<string>
    })
    auths?: string[]
}
