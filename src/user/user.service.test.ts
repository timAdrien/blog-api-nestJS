import { UserNestRepository } from './user.repository'
import { UserNestService } from './user.service'
import { UserNest } from './entity/user.entity'
import { FunctionUtils } from '../utils/functions'
import { UserNestUpdateRolePutInDto } from './dto/user-update-role-put-in.dto'
import { MailerService } from '@nest-modules/mailer';

describe('UserNestService', () => {
  let service: UserNestService
  let repository: UserNestRepository
  let mailerService: MailerService

  beforeAll(async () => {
    repository = {} as any
    mailerService = new MailerService(FunctionUtils.getOptionsMailer())
    service = new UserNestService(repository, mailerService)
  })

  describe('getById', () => {
    it('should call and return repository.findOne with id passed in param', async () => {
      const id = 'monId'
      const user = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(user)

      const result = await service.getById(id)

      expect(result).toBe(user)
      expect(repository.findOne).toHaveBeenCalledWith({"where": {"userId": id}})
    })
  })

  describe('update', () => {
    it('should call and return repository.save with dto passed in param', async () => {
      const user = new UserNest({
        email: 'ta@gmail.com',
        firstName: 'test update firstName',
        lastName: 'test update lastName',
        mobilePhone: '0654751254',
        userId: '3a1066dc-28c9-485f-a2b4-85fc231d263c',
        picture: Buffer.from(FunctionUtils.getImageDeMaNoteTPNestJSBase64()),
      })

      repository.save = jest.fn().mockResolvedValue(user)

      const result = await service.create(user)

      expect(result).toBe(user)
      expect(repository.save).toHaveBeenCalledWith(user)
    })
  })

  describe('Update user role', () => {
    it('should call and return repository.save with dto passed in param', async () => {
      let admin = new UserNest({ role: 'Administrator' })

      const params = new UserNestUpdateRolePutInDto() 
      params.adminId = 'fdposdf-fsqd9-fs42-fsd4-hkgj345erez'
      params.userId = '3a1066dc-28c9-485f-a2b4-85fc231d263c'
      params.newRole = 'Blogger'

      repository.save = jest.fn().mockResolvedValue(new UserNest({ role: params.newRole }))
      service.getById = jest.fn().mockResolvedValue(admin)

      const result = await service.updateRoleUser(params)

      expect(result.role).toBe(params.newRole)
      expect(repository.save).toHaveBeenCalledWith(new UserNest({ userId: params.userId, role: params.newRole }))
    })
  })

  describe('getAll', () => {
    it('should call return list of users', async () => {
      let lstUser = [new UserNest(), new UserNest(), new UserNest(), new UserNest()]

      repository.createQueryBuilder = jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getRawMany: jest.fn().mockReturnValueOnce(lstUser),
        }))

      const result = await service.getAll('adminId')

      expect(result).toBe(lstUser)
      expect(result.length).toBe(4)
    })
  })
})
