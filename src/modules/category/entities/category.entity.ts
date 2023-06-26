import { baseCol } from "src/common/entity/col.entity";
import { Post } from "src/modules/post/entities/post.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity({name: "category"})
export class Category extends baseCol {
    @Column({
        length: 36,
    })
    categoryName: string;

    @Column({
        length: 36
    })
    iconName: string;

    @Column({
        length: 50 
    })
    remark: string;

    @Column({
        type: "uuid",
        nullable: true,
        default: null
    })
    parentId: string;

    // 多对多关系
    @ManyToMany(() => Post, post => post.category)
    @JoinTable({
        name: "post_category"
    })
    posts: Post[];
}
