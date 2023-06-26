import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EntityManager, IsNull, Not } from 'typeorm';
import { _trim, _trim_around, _trim_left, isBool } from 'src/utils/string.util';
import { Post } from './entities/post.entity';
import { PostType, PostVisibleRange } from 'src/common/enum/common.enum';
import { generateVersionNum } from 'src/utils/version.util';
import { PostContent } from '../post-content/entities/content.entity';
import { PageVo } from 'src/utils/pagination.util';

@Injectable()
export class PostService {

  constructor(
    private readonly eManager: EntityManager,
  ) { }

  async create(createPostDto: CreatePostDto) {
    const _title = _trim_around(createPostDto.title);
    const _summary = _trim_around(createPostDto.summary);
    const _coverImage = _trim_around(createPostDto.coverImage);

    const postTypes = Object.values(PostType);
    if (!postTypes.includes(createPostDto.type)) throw new BadRequestException('Invalid post type!');

    const visibleRanges = Object.values(PostVisibleRange);
    if (!visibleRanges.includes(createPostDto.visibleRange)) throw new BadRequestException('Invalid post visible range!');

    if (!createPostDto.content || createPostDto.content.length === 0) throw new BadRequestException('Please input post content!')

    return this.eManager.transaction(async (manager) => {
      const version = generateVersionNum();

      const postContent = new PostContent();
      postContent.content = createPostDto.content;
      postContent.version = version;
      await manager.getRepository(PostContent).save(postContent);

      return await manager.getRepository(Post).save({
        title: _title,
        summary: _summary,
        coverImage: _coverImage,
        type: createPostDto.type,
        visibleRange: createPostDto.visibleRange,
        version,
        content: [postContent]
      } as Post);
    })

  }

  async findAll(pageNum: number, pageSize: number, visibleRange: PostVisibleRange = PostVisibleRange.Public, type: PostType = PostType.Original, isDel?: boolean) {
    const [data, count] = await this.eManager.getRepository(Post).findAndCount({
      where: {
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
        type,
        visibleRange
      },
      skip: pageSize * (pageNum - 1),
      take: pageSize,
      order: {
        createTime: "DESC"
      }
    })
    return new PageVo({
      pageNum,
      pageSize,
      total: count,
      data
    });
  }

  async findOne(id: string, isDel?: boolean) {
    return await this.eManager.getRepository(Post).findOne({
      where:
      {
        id,
        delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
      },
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const _post = new Post();
    _post.title = _trim_around(updatePostDto.title);
    _post.summary = _trim_around(updatePostDto.summary);
    _post.coverImage = _trim(updatePostDto.coverImage);
    _post.visibleRange = updatePostDto.visibleRange;
    _post.type = updatePostDto.type;
    return !!this.eManager.getRepository(Post).update(id, _post);
  }

  async changeVersion(id: string, version: string) {
    const post = await this.eManager.getRepository(Post).findOne({ where: { id, delFlag: IsNull() }, relations: ["content"] });
    if (!post) throw new BadRequestException("post not found!");

    if (post && post.content.length > 0) {
      const con = post.content.find(content => ((content.version === version) && !content.delFlag));
      if (!con)
        throw new BadRequestException("post content not found!");
    }

    return !!this.eManager.getRepository(Post).update(id, {
      version,
    })

  }

  remove(id: string) {
    return !!this.eManager.getRepository(Post).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(Post).update(id, { delFlag: null });
  }
}
