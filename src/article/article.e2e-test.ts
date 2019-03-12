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
import { SignUpDto } from '../auth/dto/sign-up.dto'
import { getCopyConstruction } from '../utils/copy-constructor.tools'

describe('ArticleController (e2e)', () => {
  let app: INestApplication
  let articleCreated: Article = new Article()
  let userConnected: UserNest = new UserNest()
  let token: string

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [UserNestModule, AuthModule, CommentModule, ArticleModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const authInfo: SignUpDto = {
      email: 'ta@gmail.com',
      password: 'pass',
      firstName: 'Bill',
      lastName: 'pass',
      mobilePhone: 'pass'
    }

    userConnected = new UserNest(authInfo)

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(authInfo)
      .expect(201)

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(authInfo)
      .expect(201)
    token = res.body.token
    userConnected.userId = res.body.userId
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
        author: userConnected,
        comments: [
          new Comment({ content: 'blabla' }),
          new Comment({ content: 'blabla 2' }),
        ],
      })

      return request(app.getHttpServer())
        .post('/article/create')
        .send(articleCreated)
        .expect(201)
        .then(res => {
          articleCreated = new Article(res.body)
        })
    })
  })

  describe('Get article by title', async () => {
    it('/article/get_by_title/:title unlogged', async () => {
      return request(app.getHttpServer())
        .get('/article/get_by_title/' + articleCreated.title)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual('')
          expect(res.body.author.firstName).toEqual('Bill')
          expect(res.body.comments.length).toEqual(2)
        })
    })

    it('/article/get_by_title/:title logged', async () => {
      return request(app.getHttpServer())
        .get('/article/get_by_title/' + articleCreated.title)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual('')
          expect(res.body.author.firstName).toEqual('Bill')
          expect(res.body.comments.length).toEqual(2)
        })
    })
  })

  describe('Get article by id', async () => {
    it('/article/:id unlogged', async () => {
      return request(app.getHttpServer())
        .get('/article/' + articleCreated.articleId)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual('')
          expect(res.body.author.firstName).toEqual('Bill')
          expect(res.body.comments.length).toEqual(2)
        })
    })

    it('/article/:id logged', async () => {
      return request(app.getHttpServer())
        .get('/article/' + articleCreated.articleId)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual('')
          expect(res.body.author.firstName).toEqual('Bill')
          expect(res.body.comments.length).toEqual(2)
        })
    })
  })

  describe('Get articles pagined', async () => {
    let lstArticles = []
    beforeAll(async () => {
      // Create fake articles
      let i: number
      for (i = 1; i <= 60; i++) {
        articleCreated = new Article({
          title: 'Mon article ' + i,
          content: 'Content article test',
          author: userConnected,
          comments: [],
        })
        lstArticles.push(articleCreated)
      }

      await request(app.getHttpServer())
        .post('/article/saveList')
        .send(lstArticles)
    })

    it('/article/page/:step unlogged', async () => {
      return request(app.getHttpServer())
        .get('/article/page/' + 2)
        .expect(200)
        .then(res => {
          expect(res.body.length).toBeLessThanOrEqual(20)
        })
    })

    it('/article/page/:step logged', async () => {
      return request(app.getHttpServer())
        .get('/article/page/' + 2)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          expect(res.body.length).toBeLessThanOrEqual(20)
        })
    })
  })

  describe('Get articles of author', async () => {
    it('/article/author/:id logged', async () => {
      return request(app.getHttpServer())
        .get('/article/author/' + userConnected.userId)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          // 61 because we created 1 + 60 others before
          expect(res.body.length).toBe(61)
        })
    })
  })

  describe('Update Article of author', async () => {
    it('/article/update logged', async () => {
      let articleUpdated = getCopyConstruction(Article, articleCreated) as any
      articleUpdated.title = 'New title updated'
      articleUpdated.content = 'New content updated'

      return request(app.getHttpServer())
        .put('/article/update')
        .send(articleUpdated)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          expect(res.body.title).toBe('New title updated')
          expect(res.body.content).toBe('New content updated')
        })
    })
  })
})
