import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { setupDB } from '../../test/tools/setup.tools'
import { UserNestModule } from './user.module'
import { getConnection } from 'typeorm'

describe('UserNestCotnroller (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [UserNestModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    // await app.get(ArticleRepository).clear()
    await app.close()
    await getConnection().close()
  })

  describe('Get user', () => {
    it('/user/create', () => {
      return undefined
    })
  })
})
