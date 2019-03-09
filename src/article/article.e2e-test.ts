import { INestApplication } from '@nestjs/common'
import { ArticleRepository } from './article.repository'
import { UserNestRepository } from '../user/user.repository'
import { CommentRepository } from '../comment/comment.repository'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { ArticleModule } from './article.module'
import { UserNestModule } from '../user/user.module'
import { CommentModule } from '../comment/comment.module'
import { AuthModule } from '../auth/auth.module'
import { setupDB } from '../../test/tools/setup.tools'
import { getConnection } from 'typeorm'
import { UserNest } from '../user/entity/user.entity'
import { Article } from './entity/article.entity'
import { Comment } from '../comment/entity/comment.entity'
import { AuthService } from '../auth/auth.service';

describe('ArticleController (e2e)', () => {
  let app: INestApplication
  let articleCreated: Article

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [UserNestModule, AuthModule, CommentModule, ArticleModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.get(CommentRepository).delete({})
    await app.get(ArticleRepository).delete({})
    await app.get(UserNestRepository).delete({})
    await app.close()
    await getConnection().close()
  })

  describe('Create article', async () => {
    it('/article/create', async () => {
      articleCreated = new Article({
        title: 'Mon article',
        content: 'Content article test',
        author: new UserNest({ firstName: 'Bill', lastName: 'Bob', password:  await AuthService.hashPassword('007'), email: 'ta@gmail.com', mobilePhone: '0600000000' }),
        comments: [
          new Comment({ content: 'blabla' }),
          new Comment({ content: 'blabla 2' }),
        ],
      })

      return request(app.getHttpServer())
        .post('/article/create')
        .send(articleCreated)
        .expect(201)
    })
  })

  describe('Get article by title', async () => {
    it('/article/getByTitle unlogged', async () => {
      return request(app.getHttpServer())
        .get('/article/get_by_title/' + 'Mon article')
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual('')
          expect(res.body.author.firstName).toEqual('Bill')
          expect(res.body.comments.length).toEqual(2)
        })
    })

    it('/article/getByTitle logged', async () => {
      const authInfo = { email: 'ta@gmail.com', password: '007' }
      const req = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(authInfo)
        .expect(201)

      return request(app.getHttpServer())
        .get('/article/get_by_title/' + 'Mon article')
        .set('Authorization', 'Bearer ' + req.body.token)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual('')
          expect(res.body.author.firstName).toEqual('Bill')
          expect(res.body.comments.length).toEqual(2)
        })
    })
  })
})
