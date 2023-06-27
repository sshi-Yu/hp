import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException, HttpException, Query } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';
import { Apis } from 'src/common/decorators/Apis.decorator';
import { HttpStatusCode } from 'src/common/enum/http-code.enum';
import { AuthTags } from 'src/common/decorators/AuthTag';
import { ImageType, Message, PostVisibleRange } from 'src/common/enum/common.enum';

@Controller('file')
@ApiTags("File")
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname);
        if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext.toLowerCase())) {
          return callback(new HttpException("Please upload a list of legitimate files", HttpStatusCode.InternalServerError), false);
        }
        callback(null, true);
      },
    }),
  )
  @Apis({
    options: { summary: "upload image file" },
    bodys: [{ type: CreateFileDto }]
  })
  async upload(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto) {
    return {
      data: await this.fileService.uploadFile(file, createFileDto)
    }
  }

  @Post("upload/mass")
  @UseInterceptors(
    FilesInterceptor('files', 8, {
      // 上传文件大小
      limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
      },
      // 上传文件的文件类型
      fileFilter: (req, file, callback) => {
        const ext = extname(file.originalname);
        if (!['.jpg', '.jpeg', '.png', '.gif'].includes(ext.toLowerCase())) {
          return callback(new HttpException("Please upload a list of legitimate files", HttpStatusCode.InternalServerError), false);
        }
        callback(null, true);
      }
    }),
  )
  @Apis({
    options: { summary: "mass upload image files" },
    bodys: [{ type: CreateFileDto }]
  })
  async massUpload(@UploadedFiles() files: any[], @Body() createFileDto: CreateFileDto) {
    return {
      data: await
        this.fileService.uploadFileMass(files, createFileDto)
    }
  }

  @Get("page")
  @Apis({
    options: { summary: "find files by page" },
    querys: [{
      name: "isDel",
      type: Boolean,
      required: false
    }, {
      name: "visibleRange",
      type: "enum",
      enum: PostVisibleRange,
      required: true
    }, {
      name: "type",
      type: "enum",
      enum: ImageType,
      required: true
    }]
  })
  // @AuthTags("sys:file:page")
  async findAll(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number,
    @Query("isDel") isDel?: boolean, @Query("visibleRange") visibleRange?: PostVisibleRange,
    @Query("type") type?: ImageType) {
    return {
      data: await this.fileService.findAll(pageNum, pageSize, visibleRange, type, isDel)
    }
  }

  @Get(':id')
  // @AuthTags("sys:file:one")
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  @Patch(':id')
  @Apis({
    options: { summary: "update file info" },
    bodys: [{
      type: UpdateFileDto
    }]
  })
  // @AuthTags("sys:file:update")
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateFileDto) {
    if(!id) throw new BadRequestException(Message.RequiredIdOfUpdateTarget);
    return this.fileService.update(id, updateAuthDto);
  }

  @Delete('remove:id')
  // @AuthTags("sys:file:remove")
  remove(@Param('id') id: string) {
    return this.fileService.remove(id);
  }

  @Patch("enable/:id")
  // @AuthTags("sys:file:enable")
  enable(@Param('id') id: string) {
    return this.fileService.enable(id);
  }
}
