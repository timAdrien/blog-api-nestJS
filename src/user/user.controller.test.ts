import { UserNestController } from './user.controller'
import { UserNestService } from './user.service'
import { UserNest } from './entity/user.entity';
import { UserNestUpdatePutInDto } from './dto/user-update-put-in.dto';
import { UserNestUpdateRolePutInDto } from './dto/user-update-role-put-in.dto';

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
      const user = new UserNestUpdatePutInDto()
      service.update = jest.fn().mockResolvedValue(user)

      const result = await controller.update(user)

      expect(result).toBe(user)
      expect(service.update).toHaveBeenCalledWith(new UserNest())
    })
  })

  describe('Update user role', () => {
    it('should call and return repository.save with dto passed in param', async () => {
      let admin = new UserNest({ role: 'Administrator' })

      const params = new UserNestUpdateRolePutInDto() 
      params.adminId = 'fdposdf-fsqd9-fs42-fsd4-hkgj345erez'
      params.userId = '3a1066dc-28c9-485f-a2b4-85fc231d263c'
      params.newRole = 'Blogger'

      service.updateRoleUser = jest.fn().mockResolvedValue(new UserNest({ role: params.newRole }))
      service.getById = jest.fn().mockResolvedValue(admin)

      const result = await controller.updateRoleUser(params)

      expect(result.role).toBe(params.newRole)
      expect(service.updateRoleUser).toHaveBeenCalledWith(params)
    })
  })

  describe('getAll', () => {
    it('should call return list of users', async () => {
      let lstUser = [new UserNest(), new UserNest(), new UserNest(), new UserNest()]

      service.getAll = jest.fn().mockResolvedValue(lstUser)

      const result = await controller.getAll('adminId')

      expect(result).toBe(lstUser)
      expect(result.length).toBe(4)
    })
  })
})
