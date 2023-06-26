import { Test, TestingModule } from '@nestjs/testing';
import { PostContentController } from './post-content.controller';

describe('PostContentController', () => {
  let controller: PostContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostContentController],
    }).compile();

    controller = module.get<PostContentController>(PostContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
