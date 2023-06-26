import { baseCol } from "src/common/entity/col.entity";
import { Column, Entity } from "typeorm";
import { ImageType, PostVisibleRange } from "src/common/enum/common.enum";

@Entity({ name: "file" })
export class File extends baseCol {

    @Column({
        length: 99
    })
    originalname: string;

    @Column({
        length: 64
    })
    filename: string;

    @Column({
        type: "enum",
        enum: ImageType,
        default: ImageType.Illustration
    })
    mimetype: string;

    @Column({
        type: "enum",
        enum: ImageType,
        default: ImageType.Illustration
    })
    directory: string;

    @Column({
        length: 128
    })
    description: string;

    @Column({
        length: 512
    })
    metadata: string;


    @Column({
        type: "enum",
        enum: PostVisibleRange,
        default: PostVisibleRange.Public
    })
    visibleRange: PostVisibleRange;
}
