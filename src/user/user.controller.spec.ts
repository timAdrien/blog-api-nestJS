import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('User Controller', () => {
  let controller: UserController;
  let service: UserService;

  beforeAll(async () => {
    service = {} as any;
    controller = new UserController(service);
  });

  describe('getById', () => {
    it('should return the result of service.getById', async () => {
      const id = 'monId';
      const user = { name: 'toto' };
      service.getById = jest.fn().mockResolvedValue(user);

      const result = await controller.getById(id);

      expect(result).toBe(user);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });
});
