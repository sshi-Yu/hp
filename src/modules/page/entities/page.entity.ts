import { baseCol } from "src/common/entity/col.entity";
import { PageType, StatusCode } from "src/common/enum/common.enum";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne } from "typeorm";

@Entity({
    name: "page"
})
export class Page extends baseCol {
    @Column({
        comment: "page title",
        length: 32,
        unique: true
    })
    title: string;

    @Column({
        comment: "path",
        length: 64
    })
    path: string;

    @Column({
        comment: "sort",
        type: "int",
        default: 0
    })
    sort: number;

    @Column({
        comment: "component",
        length: 64,
        unique: true,
        nullable: true
    })
    component: string;

    @Column({
        comment: "is frame link",
        type: "enum",
        default: StatusCode.No,
        enum: StatusCode
    })
    isIframe: StatusCode;

    @Column({
        comment: "is external link",
        type: "enum",
        default: StatusCode.No,
        enum: StatusCode
    })
    isLink: StatusCode;

    @Column({
        comment: "type",
        enum: PageType,
        default: PageType.Page,
        type: "enum"
    })
    type: PageType;

    @Column({
        comment: "visible",
        type: "enum",
        default: StatusCode.Yes,
        enum: StatusCode,
    })
    visible: StatusCode;

    @Column({
        comment: "redirect",
        length: 64,
        nullable: true
    })
    redirect: string;

    @Column({
        comment: "prefix icon",
        length: 32,
        nullable: true
    })
    prefixIcon: string;

    @Column({
        comment: "suffix icon",
        length: 32,
        nullable: true
    })
    suffixIcon: string;

    @Column({
        comment: "remark",
        length: 64,
        nullable: true
    })
    remark: string;

    @OneToOne(() => Auth)
    @JoinColumn({
        name: "authId",
    })
    auth: Auth;
}
