import { UserNestRepository } from './user.repository'
import { UserNestService } from './user.service'
import { UserNest } from './entity/user.entity'
import { FunctionUtils } from '../utils/functions'

describe('UserNestService', () => {
  let service: UserNestService
  let repository: UserNestRepository

  beforeAll(async () => {
    repository = {} as any
    service = new UserNestService(repository)
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
})
