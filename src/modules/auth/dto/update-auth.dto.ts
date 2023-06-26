import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateAuthDto {
    @ApiProperty({
        description: "auth name",
        minLength: 2,
        maxLength: 12,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(12)
    authName: string;

    @ApiProperty({
        description: "auth key",
        minLength: 5,
        maxLength: 24
    })
    @IsString()
    @MinLength(5)
    @MaxLength(24)
    authKey: string;

    @ApiProperty({
        description: "remark",
        maxLength: 50
    })
    @MaxLength(50)
    remark: string;

    @ApiProperty({
        description: "path",
    })
    path?: string;

    @ApiProperty({
        description: "roles",
        type: Array
    })
    roles: string[];

}
