import { baseCol } from "src/common/entity/col.entity";
import { Page } from "src/modules/page/entities/page.entity";
import { Role } from "src/modules/role/entities/role.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "auth" })
export class Auth extends baseCol {
    @Column({
        comment: "auth name",
        length: 16,
        unique: true
    })
    authName: string;
 
    @Column({
        comment: "auth key",
        length: 32,
        unique: true
    })
    authKey: string;

    @Column({
        comment: "request path",
        length: 128,
        nullable: true,
        unique: true
    })
    path: string;

    @Column({
        comment: "remark",
        length: 64,
    })
    remark: string;

    @ManyToMany(() => Role, role => role.auths)
    roles: Array<any>;
}
