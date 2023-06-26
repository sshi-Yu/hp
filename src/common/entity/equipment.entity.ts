import { Column, Entity, TableInheritance } from "typeorm";

@Entity()
export abstract class baseEquipment {

    @Column({
        comment: "设备名称",
        length: 32
    })
    equipment: string;

    @Column({
        comment: "浏览器",
        length: 32
    })
    browser: string;

    @Column({
        comment: "操作系统",
        length: 32
    })
    os: string;  //windows,linux,mac,...

    @Column({
        comment: "地理位置",
        length: 32
    })
    location: string;

    @Column({
        comment: "ip",
        length: 32
    })
    ip: string;  //ipv4,ipv6,mac,..etc. 可以使用匹配匹配模式匹配

}