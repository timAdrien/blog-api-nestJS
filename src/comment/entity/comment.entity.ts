import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Article } from '../../article/entity/article.entity'
import { User } from '../../user/entity/user.entity'
import {  getCopyConstruction, getCopyConstructions, getOrDefault } from '../../utils/copy-constructor.tools'

@Entity()
export class Comment {
  @ManyToOne(type => Article, article => article.comments)
  article: Article

  @ManyToOne(type => User, user => user.comments)
  author: User

  @PrimaryGeneratedColumn('uuid', { name: 'comment_id' })
  commentId: string

  @Column({ type: 'varchar', name: 'content' })
  content: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  constructor(copy: Partial<Comment> = {}) {
    this.commentId = getOrDefault(copy.commentId, undefined) as any
    this.author = getCopyConstruction(User, copy.author) as any
    this.article = getCopyConstruction(Article, copy.article) as any
    this.content = getOrDefault(copy.content, undefined)
  }
}
