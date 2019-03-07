import { INestApplication } from '@nestjs/common'
import { ArticleRepository } from './article.repository'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { ArticleModule } from './article.module'
import { setupDB } from '../../test/tools/setup.tools'
import { getConnection } from 'typeorm'
import { UserNest } from '../user/entity/user.entity'

describe('ArticleController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [ArticleModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.get(ArticleRepository).delete({})
    await app.close()
    await getConnection().close()
  })

  describe('Create article', () => {
    it('/article/create', () => {
      const article = {
        title: 'Mon article de test',
        content: 'Content article test',
        author: new UserNest({ firstName: 'Bill' }),
      }

      return request(app.getHttpServer())
        .post('/article/create')
        .send(article)
        .expect(201)
    })
  })
})
