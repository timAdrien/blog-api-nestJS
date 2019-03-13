import { UserNestController } from './user.controller'
import { UserNestService } from './user.service'
import { UserNestUpdatePostInDto } from './dto/user-update-post-in.dto';
import { UserNest } from './entity/user.entity';

describe('UserNest Controller', () => {
  let controller: UserNestController
  let service: UserNestService

  beforeAll(async () => {
    service = {} as any
    controller = new UserNestController(service)
  })

  describe('getById', () => {
    it('should return the result of service.getById', async () => {
      const id = 'monId'
      const user = { name: 'toto' }
      service.getById = jest.fn().mockResolvedValue(user)

      const result = await controller.getById(id)

      expect(result).toBe(user)
      expect(service.getById).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update the user and return it', async () => {
      const user = new UserNestUpdatePostInDto()
      service.update = jest.fn().mockResolvedValue(user)

      const result = await controller.update(user)

      expect(result).toBe(user)
      expect(service.update).toHaveBeenCalledWith(new UserNest())
    })
  })
})
