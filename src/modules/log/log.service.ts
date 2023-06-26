import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';
import { PageVo } from 'src/utils/pagination.util';
import { HandleRes } from 'src/common/enum/http-method.enum';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepo: Repository<Log>
  ) { }

  create(createLogDto: CreateLogDto) {
    this.logRepo.save(createLogDto);
  }

  async findByPage(pageNum: number, pageSize: number) {
    const [data, count] = await this.logRepo.findAndCount({
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      order: {
        createTime: "desc"
      }
    })
    return new PageVo({
      pageNum,
      pageSize,
      total: count,
      data
    })
  }

  async findByType(type: HandleRes, pageNum: number, pageSize: number) {
    const [data, count] = await this.logRepo.findAndCount({
      where: {
        type,
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      order: {
        createTime: "desc"
      }
    })
    return new PageVo({
      pageNum,
      pageSize,
      total: count,
      data
    });
  }
}
