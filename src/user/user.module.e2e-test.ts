import { INestApplication, HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { setupDB } from '../../test/tools/setup.tools'
import { UserNestModule } from './user.module'
import { getConnection } from 'typeorm'
import { UserNest } from './entity/user.entity'
import * as request from 'supertest'
import { SignInDto } from '../auth/dto/sign-in.dto'
import { SignUpDto } from '../auth/dto/sign-up.dto'
import { AuthModule } from '../auth/auth.module'
import { UserNestRepository } from './user.repository'
import { FunctionUtils } from '../utils/functions'

describe('UserNestController (e2e)', () => {
  let app: INestApplication
  let token: string = null
  const userConnected: UserNest = new UserNest()

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [UserNestModule, AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.get(UserNestRepository).delete({})
    await app.close()
    await getConnection().close()
  })

  describe('User Sign in/up', async () => {
    it('Sign up', async () => {
      const authInfo: SignUpDto = {
        email: 'auser@gmail.com',
        password: 'pass',
        firstName: 'pass',
        lastName: 'pass',
        mobilePhone: 'pass',
      }

      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(authInfo)
        .expect(201)
    })

    it('Disallow sign in sans bon password', async () => {
      const authInfo: SignInDto = {
        email: 'auser@gmail.com',
        password: 'passfaux',
      }
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(authInfo)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('Sign in OK', async () => {
      const authInfo: SignInDto = { email: 'auser@gmail.com', password: 'pass' }
      const req = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(authInfo)
        .expect(201)
      token = req.body.token
      userConnected.userId = req.body.userId
      return null
    })
  })

  describe('User Sign in/up', async () => {
    it('Update user infos', async () => {
      userConnected.email = 'ta-modified@gmail.com'
      userConnected.firstName = 'modified test update firstName'
      userConnected.lastName = 'modified test update lastName'
      userConnected.mobilePhone = '0600000000'
      // #55 issue
      userConnected.picture = Buffer.from(FunctionUtils.getImageDeMaNoteTPNestJSBase64())

      return request(app.getHttpServer())
        .put('/user')
        .set('Authorization', 'Bearer ' + token)
        .send(userConnected)
        .expect(200)
        .then(res => {
          expect(res.body.email).toEqual('ta-modified@gmail.com')
          expect(res.body.firstName).toEqual('modified test update firstName')
          expect(res.body.lastName).toEqual('modified test update lastName')
          expect(res.body.mobilePhone).toEqual('0600000000')
          // #55 issue
          expect(Buffer.from(res.body.picture.data)).toEqual(userConnected.picture)
        })
    })
  })
})
