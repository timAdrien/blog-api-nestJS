import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Article } from '../../article/entity/article.entity'
import { Comment } from '../../comment/entity/comment.entity'
import { getCopyConstructions, getOrDefault } from '../../utils/copy-constructor.tools'

@Entity()
export class UserNest {
  @OneToMany(type => Article, article => article.author)
  articles: Article[]

  @OneToMany(type => Comment, comment => comment.author)
  comments: Comment[]

  @CreateDateColumn()
  created: Date

  @Column({ type: 'varchar', name: 'email', length: 200, unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', name: 'first_name', length: 100 })
  firstName: string

  @Column({ type: 'varchar', name: 'last_name', length: 100 })
  lastName: string

  @Column({ type: 'varchar', name: 'mobile_phone', length: 31 })
  mobilePhone: string

  @Column({ type: 'varchar', name: 'password' })
  password: string

  @Column({ type: 'varchar', name: 'picture', nullable: true })
  picture: Buffer | File
  
  @Column({ type: 'varchar', name: 'role', default: 'User' })
  role: string

  @UpdateDateColumn()
  updated: Date

  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string

  constructor(copy: Partial<UserNest> = {}) {
    this.email = getOrDefault(copy.email, undefined) as any
    this.articles = getCopyConstructions(Article, copy.articles) as any
    this.comments = getCopyConstructions(Comment, copy.comments) as any
    this.firstName = getOrDefault(copy.firstName, undefined)
    this.lastName = getOrDefault(copy.lastName, undefined)
    this.mobilePhone = getOrDefault(copy.mobilePhone, undefined)
    this.password = getOrDefault(copy.password, undefined)
    this.role = getOrDefault(copy.role, undefined)
    this.picture = getOrDefault(copy.picture, undefined)
    this.userId = getOrDefault(copy.userId, undefined) as any
  }
}
