import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";
import { FriendStatusCode } from "src/common/enum/common.enum";

export class CreateFriendDto {
    @ApiProperty({
        maxLength: 64,
        description: "website master"
    })
    @IsString({ message: "Please input webmaster name!" })
    master: string;

    @ApiProperty({
        maxLength: 64,
        description: "friend's website name"
    })
    @IsString({ message: "Please input website name!" })
    name: string;

    @ApiProperty({
        maxLength: 128,
        description: "friend's website url"
    })
    @IsUrl({}, { message: "Please input webmaster name!" })
    url: string;

    @ApiProperty({
        description: "friend's avatar url",
        maxLength: 128
    })
    @IsUrl({}, { message: "Please input valid avatar url!" })
    avatar: string;

    @ApiProperty({
        maxLength: 128,
        description: "friend's description"
    })
    @IsString({ message: "How should I describe your site!" })
    description: string;

    @ApiProperty({
        description: "Friend link application status",
        type: "enum",
        enum: FriendStatusCode,
        default: FriendStatusCode.Pending
    })
    status: FriendStatusCode;
}
