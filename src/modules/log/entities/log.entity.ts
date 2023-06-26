import { type } from "os";
import { baseCol } from "src/common/entity/col.entity";
import { baseEquipment } from "src/common/entity/equipment.entity";
import { HandleRes, HttpMethod } from "src/common/enum/http-method.enum";
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: "log"
})
export class Log extends baseEquipment {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createTime: Date;

    @Column({
        comment: "处理主体",
        length: 128
    })
    hander: string;

    @Column({
        comment: "处理结果", // Error || Message
        type: "enum",
        enum: HandleRes
    })
    type: HandleRes;

    @Column({
        comment: "请求方式",
        type: "enum",
        enum: HttpMethod
    })
    // 请求方式 
    method: HttpMethod;

    @Column({
        comment: "请求参数",
        type: "longtext"
    })
    params: string

    @Column({
        comment: "url",
        length: 128
    })
    url: string;

    @Column({
        comment: "响应体",
        type: "longtext",
        nullable: true
    })
    resp: string;
}
