import { Test, TestingModule } from '@nestjs/testing';
import { PostContentService } from './post-content.service';

describe('PostContentService', () => {
  let service: PostContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostContentService],
    }).compile();

    service = module.get<PostContentService>(PostContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
