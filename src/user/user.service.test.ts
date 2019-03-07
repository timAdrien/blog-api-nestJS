import { UserNestRepository } from './user.repository'
import { UserNestService } from './user.service'

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
      expect(repository.findOne).toHaveBeenCalledWith(id)
    })
  })
})
