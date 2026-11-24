import type { Repository } from 'typeorm';
import type { PostEntity } from './post.entity.js';
import { BaseService } from '../../core/base.service.js';

export default class PostService extends BaseService<
  PostEntity,
  Repository<PostEntity>
> {
  name = 'post';

  constructor(readonly repository: Repository<PostEntity>) {
    super(repository);
  }
}
