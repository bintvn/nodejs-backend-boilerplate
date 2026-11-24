import { Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { CategoryEntity } from './category.entity.js';
import { PostEntity } from '../post/post.entity.js';
import { BaseEntity } from '../../core/base.entity.js';

@Entity('category_post')
export class CategoryPostEntity extends BaseEntity {
  @ManyToOne(() => CategoryEntity, (category) => category.categoryPosts, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_category_post_category_id',
  })
  category?: Relation<CategoryEntity[]>;

  @ManyToOne(() => PostEntity, (post) => post.categoryPosts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_category_post_post_id',
  })
  post?: Relation<PostEntity[]>;
}
