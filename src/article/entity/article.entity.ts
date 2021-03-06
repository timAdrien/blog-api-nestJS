import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm'
import { Comment } from '../../comment/entity/comment.entity'
import { UserNest } from '../../user/entity/user.entity'
import {  getCopyConstruction, getCopyConstructions, getOrDefault } from '../../utils/copy-constructor.tools'
import { NoteArticle } from './note-article.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid', { name: 'article_id' })
  articleId: string

  @ManyToOne(type => UserNest, user => user.articles, {
    eager: true,
    cascade: true, 
    onDelete: "CASCADE"
  })
  author: UserNest

  @OneToOne(type => NoteArticle, note => note.article, {
    eager: true,
    cascade: true, 
    onDelete: "CASCADE"
  })
  noteArticle: NoteArticle

  @OneToMany(type => Comment, comment => comment.article, {
    eager: true,
    cascade: true
  })
  comments: Comment[]

  @Column({ type: 'varchar', name: 'content' })
  content: string

  @CreateDateColumn()
  created: Date

  @Column({ type: 'timestamp', name: 'date_last_token', nullable: true })
  dateLastToken: Date

  @Column({ type: 'int', name: 'dis_likes', nullable: true })
  disLikes: number

  @Column({ type: 'int', name: 'likes', nullable: true })
  likes: number
  
  @Column({ type: 'varchar', name: 'title', unique: true })
  title: string

  @UpdateDateColumn()
  updated: Date

  constructor(copy: Partial<Article> = {}) {
    this.articleId = getOrDefault(copy.articleId, undefined) as any
    this.author = getCopyConstruction(UserNest, copy.author) as any
    this.comments = getCopyConstructions(Comment, copy.comments) as any
    this.content = getOrDefault(copy.content, undefined)
    this.dateLastToken = getOrDefault(copy.dateLastToken, undefined)
    this.disLikes = getOrDefault(copy.disLikes, undefined)
    this.likes = getOrDefault(copy.likes, undefined)
    this.title = getOrDefault(copy.title, undefined)
  }
}
