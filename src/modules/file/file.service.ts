import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, createWriteStream, unlink } from 'fs';
import { HttpStatusCode } from 'src/common/enum/http-code.enum';
import { EntityManager, IsNull, Not } from 'typeorm';
import { File } from './entities/file.entity';
import { ImageType, PostVisibleRange } from 'src/common/enum/common.enum';
import { _trim_around, isBool } from 'src/utils/string.util';
import { PageVo } from 'src/utils/pagination.util';

@Injectable()
export class FileService {

  constructor(
    private readonly eManager: EntityManager
  ) { }

  async create(createFileDto: CreateFileDto, metadata: string, oName: string, fName: string) {
    if (!Object.values(ImageType).includes(createFileDto.type)) throw new BadRequestException("Please provide valid image type!");
    if (!Object.values(PostVisibleRange).includes(createFileDto.visibleRange)) throw new BadRequestException("Please provide valid visible range!");
    await this.eManager.getRepository(File).save({
      description: _trim_around(createFileDto.description),
      visibleRange: createFileDto.visibleRange,
      mimetype: createFileDto.type,
      directory: createFileDto.type,
      metadata,
      originalname: oName,
      filename: fName
    } as File)
  }

  async findAll(pageNum: number, pageSize: number, visibleRange: PostVisibleRange = PostVisibleRange.Public, type: ImageType = ImageType.Illustration, isDel?: boolean,) {
    const [data, count] = await this.eManager.getRepository(File).findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
        visibleRange,
        mimetype: type
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: {
        createTime: "DESC"
      }
    })
    return new PageVo({
      pageNum, pageSize, total: count, data
    });
  }

  findOne(id?: string, fileName?: string, isDel?: boolean) {
    return this.eManager.getRepository(File).findOne({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
        id,
        filename: fileName
      },
    });
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    if (!Object.values(ImageType).includes(updateFileDto.type)) throw new BadRequestException("Please provide valid image type!");
    if (!Object.values(PostVisibleRange).includes(updateFileDto.visibleRange)) throw new BadRequestException("Please provide valid visible range!");
    this.eManager.getRepository(File).update({
      visibleRange: updateFileDto.visibleRange,
      description: _trim_around(updateFileDto.description),
      mimetype: updateFileDto.type,
    }, { id })
  }

  remove(id: string) {
    return !!this.eManager.getRepository(File).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(File).update(id, { delFlag: null });
  }

  async uploadFile(file: Express.Multer.File, createDto: CreateFileDto) {
    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('') + +new Date();
    const fileName = `${randomName}${extname(file.originalname)}`;
    await this.moveFile(file, `../../../assets/images/${fileName}`);

    await this.create(createDto, JSON.stringify({
      size: file.size,
      filename: fileName,
      originalname: file.originalname,
    }), file.originalname, fileName);

    return {
      filename: fileName,
      originalname: file.originalname,
    };
  }

  async uploadFileMass(files: Express.Multer.File[], createDto: CreateFileDto) {
    try {
      // 使用 Promise.all() 并行处理所有文件
      return await Promise.allSettled(files.map(async (file) => {
        const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('') + +new Date();
        const fileName = `${randomName}${extname(file.originalname)}`;
        const filePath = `../../../assets/images/${fileName}`;
        await this.moveFile(file, filePath);

        await this.create(createDto, JSON.stringify({
          size: file.size,
          filename: fileName,
          originalname: file.originalname,
        }), file.originalname, fileName);

        return {
          fileName,
          originalName: file.originalname
        };
      }));

    } catch (error) {
      throw new HttpException("Upload error", HttpStatusCode.InternalServerError);
    }
  }

  private moveFile(file, path) {
    return new Promise((resolve, reject) => {
      createWriteStream(join(__dirname, path))
        .write(Buffer.from(file.buffer), err => {
          reject(err);
          if (err) throw new BadRequestException(err);
        });
      resolve(true);
    });
  }

  private async deleteFile(filePath) {
    await unlink(filePath, err => {
      throw new HttpException("Failed to delete file", HttpStatusCode.InternalServerError);
    });
  }
}
