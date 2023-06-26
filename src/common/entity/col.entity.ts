import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class baseCol {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({
        comment: "创建日期"
    })
    createTime: Date; 		//创建日期

    @UpdateDateColumn({
        comment: "更新日期"
    })
    updateTime: Date; 		//更新日期

    @Column({
        default: null,
        select: false,
        comment: "逻辑删除标识", 	//列的描述内容. 可以是数据库的字段描述或其他意
        nullable: true
    })
    delFlag: Date;
}