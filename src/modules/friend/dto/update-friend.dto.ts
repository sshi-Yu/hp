import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendStatusCode } from 'src/common/enum/common.enum';

export class UpdateFriendDto extends PartialType(CreateFriendDto) {
    @ApiProperty({
        maxLength: 64,
        description: "website master"
    })
    master: string;

    @ApiProperty({
        maxLength: 64,
        description: "friend's website name"
    })
    name: string;

    @ApiProperty({
        maxLength: 128,
        description: "friend's website url"
    })
    url: string;

    @ApiProperty({
        description: "friend's avatar url",
        maxLength: 128
    })
    avatar: string;

    @ApiProperty({
        maxLength: 128,
        description: "friend's description"
    })
    description: string;

    @ApiProperty({
        description: "Friend link application status",
        type: "enum",
        enum: FriendStatusCode,
        default: FriendStatusCode.Pending
    })
    status: FriendStatusCode;
}
