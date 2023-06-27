import { baseCol } from "src/common/entity/col.entity";
import { SourceType } from "src/common/enum/common.enum";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({ name: "comment" })
export class Comment extends baseCol {

    @Column({
        length: 256,
        comment: "comment content"
    })
    content: string;

    @Column({
        length: 64,
        comment: "id of the binding target",
        type: "uuid"
    })
    source: string;

    @Column({
        type: "enum",
        enum: SourceType,
    })
    sourceType: SourceType;

    @Column({
        type: "integer",
        default: 0
    })
    like: number;

    @Column({
        type: "boolean",
        default: false
    })
    isTop: boolean;

    @Column({
        type: "boolean",
        default: true
    })
    allowComment: boolean;

    @OneToMany(() => Comment, comment => comment.parent)
    children: Comment[];

    @ManyToOne(() => Comment, comment => comment.children)
    @JoinColumn({ name: 'parentId' })
    parent: Comment;

    @OneToMany(() => Comment, comment => comment.replyTo)
    replies: Comment[];

    @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
    @JoinColumn({ name: "replyTo" })
    replyTo: Comment;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: "reviewerId" })
    reviewer: User;
}
