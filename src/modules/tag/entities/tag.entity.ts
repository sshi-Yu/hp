import { baseCol } from "src/common/entity/col.entity";
import { Post } from "src/modules/post/entities/post.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity("tag")
export class Tag extends baseCol {
    @Column({
        length: 36,
    })
    tagName: string;

    @Column({
        length: 36
    })
    iconName: string;

    @Column({
        length: 50
    })
    remark: string;

    // 多对多关系
    @ManyToMany(() => Post, post => post.tags)
    @JoinTable({
        name: "post_tag"
    })
    posts: Post[];
}
