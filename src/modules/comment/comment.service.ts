import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EntityManager, IsNull, Like, Not } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { SourceType } from 'src/common/enum/common.enum';
import { Friend } from '../friend/entities/friend.entity';
import { Post } from '../post/entities/post.entity';
import { _trim, _trim_around, isBool } from 'src/utils/string.util';
import { User } from '../user/entities/user.entity';
import { PageVo } from 'src/utils/pagination.util';

@Injectable()
export class CommentService {

  constructor(
    private readonly eManager: EntityManager
  ) { }

  async create(createCommentDto: CreateCommentDto) {


    if (!_trim_around(createCommentDto.content)) throw new BadRequestException("Please input comment content!");
    if (!Object.values(SourceType).includes(createCommentDto.sourceType)) throw new BadRequestException("Please provide valid sourceType!");
    await this.verifySourceValidity(createCommentDto.sourceType, createCommentDto.source);

    let replyTarget = null;
    if (createCommentDto.replyTo) {
      replyTarget = await this.eManager.getRepository(Comment).findOne({ where: { id: createCommentDto.replyTo, delFlag: null } });
      if (!replyTarget) throw new BadRequestException("Invalid reply target!");
    }

    let parentComment: Comment = null;
    if (createCommentDto.parentId) {
      parentComment = await this.eManager.getRepository(Comment).findOne({ where: { id: createCommentDto.parentId, delFlag: null, allowComment: true, parent: IsNull() } })
      if (!parentComment) throw new BadRequestException("This comment has been removed or banned");
    }

    return this.eManager.transaction(async (manager) => {
      const reviewer = await this.createOneNewUser(manager, createCommentDto.nickName, createCommentDto.email, createCommentDto.website);
      if (!reviewer) throw new BadRequestException("Invalid identity, please re-verify identity!");

      return await manager.getRepository(Comment).save({
        content: _trim_around(createCommentDto.content),
        isTop: createCommentDto.isTop || false,
        allowComment: createCommentDto.allowComment || true,
        replyTo: replyTarget,
        reviewer: reviewer,
        parent: parentComment,
        like: createCommentDto.like || Math.floor(Math.random() * 10),
        source: _trim(createCommentDto.source),
        sourceType: _trim(createCommentDto.sourceType)
      } as Comment);
    })
  }

  async findAll(pageNum: number, pageSize: number, comment?: CreateCommentDto, isDel?: boolean, hasReplies?: boolean, hasChildren?: boolean) {
    let relations = [];
    if (isBool(hasReplies)) relations.push("replies");
    if (isBool(hasChildren)) relations.push("children", "children.replyTo"); // 递归指定关联查询子级，并且指定查询子级时携带子级间的回复关系（replyTo/replies）

    const condition = {
      delFlag: isBool(isDel) ? Not(IsNull()) : IsNull(),
      parent: IsNull(), // 只查询顶级评论，通过以下操作确定是否携带子级 
    };
    if (comment.content !== undefined && comment.content !== null && comment.content !== "") condition["content"] = Like(`%${_trim_around(comment.content)}%`);
    if (comment.isTop !== undefined) condition["isTop"] = isBool(comment.isTop);
    if (comment.allowComment !== undefined) condition["allowComment"] = isBool(comment.allowComment);
    if (comment.source !== undefined) condition["source"] = comment.source;
    if (comment.sourceType !== undefined) condition["sourceType"] = comment.sourceType;

    const [data, count] = await this.eManager.getRepository(Comment).findAndCount({
      where: condition,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: {
        createTime: "DESC"
      },
      relations
    })
    return new PageVo({
      pageNum, pageSize, total: count, data
    });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    if (!updateCommentDto.content) throw new BadRequestException("Please input comment content!");

    const comment = new Comment();
    if (updateCommentDto.isTop !== undefined) comment.isTop = isBool(updateCommentDto.isTop);
    if (updateCommentDto.allowComment !== undefined) comment.allowComment = isBool(updateCommentDto.allowComment);
    if (updateCommentDto.like !== undefined) comment.like = +updateCommentDto.like;

    comment.content = _trim_around(updateCommentDto.content);

    return this.eManager.getRepository(Comment).update(comment, { id })
  }

  remove(id: string) {
    return !!this.eManager.getRepository(Comment).update(id, { delFlag: new Date() });
  }

  enable(id: string) {
    return !!this.eManager.getRepository(Comment).update(id, { delFlag: null });
  }

  private async verifySourceValidity(sourceType: SourceType, source: string) {
    if (!source) throw new BadRequestException("Please provide a valid source!");
    if (sourceType === SourceType.Friend) {
      const friend = await this.eManager.getRepository(Friend).findOne({ where: { id: source } });
      if (!friend) throw new BadRequestException("Please provide a valid source!");
    }
    if (sourceType === SourceType.Post) {
      const post = await this.eManager.getRepository(Post).findOne({ where: { id: source } });
      if (!post) throw new BadRequestException("Please provide a valid source!");
    }
    // if (sourceType === SourceType.Talk) {
    //   const talk = await this.eManager.getRepository(Talk).findOne({ where: { id: source } });
    //   if (!talk) throw new BadRequestException("Please provide a valid source!");
    // }
  }

  private async createOneNewUser(manager: EntityManager, nickName: string, email: string, website: string) {
    let user = null;
    user = await manager.getRepository(User).findOne({ where: { email, delFlag: null } });
    if (!user) {// if user not exist
      user = await manager.getRepository(User).save({
        nickName,
        email,
        website
      })
    }
    return user;
  }
}
