import { baseCol } from "src/common/entity/col.entity";
import { PostType, PostVisibleRange } from "src/common/enum/common.enum";
import { Category } from "src/modules/category/entities/category.entity";
import { PostContent } from "src/modules/post-content/entities/content.entity";
import { Tag } from "src/modules/tag/entities/tag.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from "typeorm";

@Entity("post")
export class Post extends baseCol {
    // 文章标题
    @Column({ length: 128 })
    title: string;

    // 文章类型
    @Column({
        type: 'enum',
        enum: PostType,
        default: PostType.Original
    })
    type: PostType;

    // 封面图
    @Column({
        length: 128,
    })
    coverImage: string;

    // 文章摘要
    @Column({ length: 256 })
    summary: string;

    // 可见范围
    @Column({
        type: 'enum',
        enum: PostVisibleRange,
        default: PostVisibleRange.Public
    })
    visibleRange: PostVisibleRange;

    @OneToMany(() => PostContent, postContent => postContent.post)
    @JoinColumn({
        name: "id",
        referencedColumnName: "postId"
    })
    content: PostContent[];

    @Column({
        comment: "version",
        length: 32
    })
    version: string;

    // 文章分类
    @ManyToMany(() => Category, category => category.posts)
    category: Category[];

    // 文章标签
    @ManyToMany(() => Tag, tag => tag.posts)
    tags: Tag[];
}

