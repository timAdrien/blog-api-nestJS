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
import { IAuthHeaders } from '../auth/interfaces/IAuthHeaders'

describe('UserNestController (e2e)', () => {
  let app: INestApplication
  let token: string = null
  const userConnected: UserNest = new UserNest()
  let userAdmin: UserNest = new UserNest()
  let headers: IAuthHeaders

  beforeAll(async () => {
    await setupDB()

    const moduleFixture = await Test.createTestingModule({
      imports: [UserNestModule, AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    headers = (await FunctionUtils.generateUserTest(app, 'headers@gmail.com')).headers
    userAdmin = (await FunctionUtils.generateUserTest(app, 'admin@gmail.com')).user
    
    await request(app.getHttpServer())
        .post('/user/TestRoute_setRoleUser')
        .set(headers)
        .send({ userId: userAdmin.userId, role: 'Administrator' })
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
      userConnected.email = 'ta@gmail.com'
      userConnected.firstName = 'modified test update firstName'
      userConnected.lastName = 'modified test update lastName'
      userConnected.mobilePhone = '0600000000'
      // #55 issue
      userConnected.picture = Buffer.from(FunctionUtils.getImageDeMaNoteTPNestJSBase64())

      return request(app.getHttpServer())
        .put('/user')
        .set(headers)
        .send(userConnected)
        .expect(200)
        .then(res => {
          expect(res.body.email).toEqual('ta@gmail.com')
          expect(res.body.firstName).toEqual('modified test update firstName')
          expect(res.body.lastName).toEqual('modified test update lastName')
          expect(res.body.mobilePhone).toEqual('0600000000')
          // #55 issue
          expect(Buffer.from(res.body.picture.data)).toEqual(userConnected.picture)
        })
    })
  })

  describe('Update Role', async () => {
    it('As non admin i cannot update user role', async () => {
      return request(app.getHttpServer())
        .put('/user/updateRole')
        .set(headers)
        .send({ adminId: userConnected.userId, userId: userConnected.userId, newRole: 'Blogger' })
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('As admin update user role', async () => {
      return request(app.getHttpServer())
        .put('/user/updateRole')
        .set(headers)
        .send({ adminId: userAdmin.userId, userId: userConnected.userId, newRole: 'Blogger' })
        .expect(200)
        .then(res => {
          expect(res.body.role).toEqual('Blogger')
        })
    })
  })

  describe('As admin get all users', async () => {
    it('As non admin i cannot get all users', async () => {
      return request(app.getHttpServer())
        .get('/user/getAll/' + userConnected.userId)
        .set(headers)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it('As admin get all users', async () => {
      return request(app.getHttpServer())
        .get('/user/getAll/' + userAdmin.userId)
        .set(headers)
        .expect(200)
        .then(res => {
          // 3 because (the one created to get headers, the admin, and the simple user)
          expect(res.body.length).toEqual(3)
          // The number of properties getted (userId, firstName, lastName, role)
          expect(Object.keys(res.body[0]).length).toEqual(4)
        })
    })
  })
})
