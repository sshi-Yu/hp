import { baseCol } from "src/common/entity/col.entity";
import { FriendStatusCode } from "src/common/enum/common.enum";
import { Column, Entity } from "typeorm";

@Entity({ name: "friend" })
export class Friend extends baseCol {

    @Column({
        length: 64,
        comment: "website master"
    })
    master: string;

    @Column({
        length: 64,
        comment: "friend's website name"
    })
    name: string;

    @Column({
        length: 128,
        comment: "friend's website url"
    })
    url: string;

    @Column({
        comment: "friend's avatar url",
        length: 128
    })
    avatar: string;

    @Column({
        length: 128,
        comment: "friend's description"
    })
    description: string;

    @Column({
        comment: "Friend link application status",
        type: "enum",
        enum: FriendStatusCode,
        default: FriendStatusCode.Pending
    })
    status: FriendStatusCode;
}
