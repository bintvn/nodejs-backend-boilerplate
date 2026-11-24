import { Column, Entity, Index, OneToMany, type Relation } from 'typeorm';
import { CategoryPostEntity } from './category-post.entity.js';
import { BaseEntity } from '../../core/base.entity.js';

@Entity('category')
@Index('uq_category_slug', ['slug'], { unique: true })
export class CategoryEntity extends BaseEntity {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
  })
  slug: string;

  @Column({
    name: 'content',
    type: 'longtext',
    nullable: true,
  })
  content: string | null;

  @OneToMany(() => CategoryPostEntity, (categoryPost) => categoryPost.post)
  categoryPosts?: Relation<CategoryPostEntity[]>;
}
