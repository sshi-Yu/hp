import { baseCol } from "src/common/entity/col.entity";
import { Post } from "src/modules/post/entities/post.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({
    name: "post-content"
})
export class PostContent extends baseCol {
    @Column({
        comment: "content of post",
        type: "longtext",
        nullable: true
    })
    content: string;

    @ManyToOne(() => Post, post => post.content) 
    @JoinColumn({
        name: "postId",
        referencedColumnName: "id"
    })
    post: Post;

    @Column({
        comment: "version",
        length: 32
    })
    version: string;
}