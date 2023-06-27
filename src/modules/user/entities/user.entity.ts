import { baseCol } from "src/common/entity/col.entity";
import { Sex } from "src/common/enum/common.enum";
import { Comment } from "src/modules/comment/entities/comment.entity";
import { Role } from "src/modules/role/entities/role.entity";
import { BeforeRemove, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";

@Entity({
    name: "user"
})
export class User extends baseCol {

    @Column({
        comment: "用户名",
        length: 12,
        unique: true,
        nullable: true
    })
    account: string;

    @Column({
        comment: "password",
        length: 128,
        select: false,
        nullable: true
    })
    password: string;

    @Column({
        comment: "昵称",
        length: 32,
        unique: true
    })
    nickName: string;

    @Column({
        comment: "性别 0-未知 1-男 2-女",
        default: Sex.Unknown,
        enum: Sex,
        type: "enum"
    })
    sex: Sex;

    @Column({
        comment: "年龄",
        nullable: true
    })
    age: number;

    @Column({
        comment: "头像地址",
        default: "",
        length: 128
    })
    avatar: string;

    @Column({
        comment: "头像地址",
        default: "",
        length: 128
    })
    website: string;

    @Column({
        comment: "签名",
        default: "",
        length: 128
    })
    signature: string;

    @Column({
        comment: "爱好", // "a, b, c..."
        length: 128,
        nullable: true
    })
    hobbies: string;

    @Column({
        comment: "手机号码",
        length: 16,
        nullable: true
    })
    phone: string;

    @Column({
        comment: "email",
        length: 64,
        nullable: true,
        unique: true
    })
    email: string;

    @Column({
        comment: "qq",
        length: 16,
        nullable: true
    })
    qq: string;

    @Column({
        comment: "wechat",
        length: 24,
        nullable: true
    })      
    wechat: string;

    @Column({
        comment: "wechat qrcode",
        length: 128,
        nullable: true
    })
    wechatQrcode: string;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: "user_role",
    })
    roles: Role[];

    @OneToMany(() => Comment, comment => comment.reviewer)
    comments: Comment[];
}