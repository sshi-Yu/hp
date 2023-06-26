import { IsString, MaxLength, MinLength } from "class-validator";
import { baseCol } from "src/common/entity/col.entity";
import { Auth } from "src/modules/auth/entities/auth.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "role" })
export class Role extends baseCol {
    @Column({
        comment: "role name",
        length: 16,
        unique: true
    })
    roleName: string;

    @Column({
        comment: "role key",
        length: 16,
        unique: true
    })
    @IsString()
    @MinLength(4)
    @MaxLength(8)
    roleKey: string;

    @Column({ 
        comment: "remark",
        length: 128 
    })
    remark: string;

    @ManyToMany(() => Auth, auth => auth.roles)
    @JoinTable({
        name: "role_auth" 
    })
    auths: Auth[]  

    @ManyToMany(() => User, user => user.roles)
    users: 	User[];
}
  