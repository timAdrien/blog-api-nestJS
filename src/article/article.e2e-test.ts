import { INestApplication, HttpStatus } from '@nestjs/common'
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
import { ArticleDeleteInDto } from './dto/article-delete-in.dto'
import { FunctionUtils } from '../utils/functions'
import { IAuthHeaders } from '../auth/interfaces/IAuthHeaders'

describe('ArticleController (e2e)', () => {
  let app: INestApplication
  let articleCreated: Article = new Article()
  let userAdmin: UserNest = new UserNest()
  let userAuthor: UserNest = new UserNest()
  let headers: IAuthHeaders

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [UserNestModule, AuthModule, CommentModule, ArticleModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    headers = (await FunctionUtils.generateUserTest(app, 'headers@gmail.com')).headers
    userAdmin = (await FunctionUtils.generateUserTest(app, 'admin@gmail.com')).user
    userAuthor = (await FunctionUtils.generateUserTest(app, 'author@gmail.com')).user
    
    await request(app.getHttpServer())
        .post('/user/TestRoute_setRoleUser')
        .set(headers)
        .send({ userId: userAdmin.userId, role: 'Administrator' })
    
    const res = await request(app.getHttpServer())
        .post('/user/TestRoute_setRoleUser')
        .set(headers)
        .send({ userId: userAuthor.userId, role: 'Author' })
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
        author: userAuthor,
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
          expect(res.body.author.password).toEqual(null)
          expect(res.body.author.firstName).toEqual('Bilbon')
          expect(res.body.comments.length).toEqual(2)
        })
    })

    it('/article/get_by_title/:title logged', async () => {
      return request(app.getHttpServer())
        .get('/article/get_by_title/' + articleCreated.title)
        .set(headers)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual(null)
          expect(res.body.author.firstName).toEqual('Bilbon')
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
          expect(res.body.author.password).toEqual(null)
          expect(res.body.author.firstName).toEqual('Bilbon')
          expect(res.body.comments.length).toEqual(2)
        })
    })

    it('/article/:id logged', async () => {
      return request(app.getHttpServer())
        .get('/article/' + articleCreated.articleId)
        .set(headers)
        .expect(200)
        .then(res => {
          expect(res.body.author.password).toEqual(null)
          expect(res.body.author.firstName).toEqual('Bilbon')
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
          author: userAuthor,
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
        .set(headers)
        .expect(200)
        .then(res => {
          expect(res.body.length).toBeLessThanOrEqual(20)
        })
    })
  })

  describe('Get articles of author', async () => {
    it('/article/author/:id logged', async () => {
      return request(app.getHttpServer())
        .get('/article/author/' + userAuthor.userId)
        .set(headers)
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
        .set(headers)
        .expect(200)
        .then(res => {
          expect(res.body.title).toBe('New title updated')
          expect(res.body.content).toBe('New content updated')
        })
    })
  })

  describe('Delete Article of author', async () => {
    it('/article/delete logged', async () => {
      let dataToSend: ArticleDeleteInDto 
      await request(app.getHttpServer())
        .get('/article/author/' + userAuthor.userId)
        .set(headers)
        .expect(200)
        .then(res => {
          dataToSend = { articleId: res.body[0].articleId, authorId: userAuthor.userId }
        })

      return request(app.getHttpServer())
        .delete('/article/delete')
        .send(dataToSend)
        .set(headers)
        .expect(200)
    })
  })
})
