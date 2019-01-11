import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeAll(async () => {
    repository = {} as any;
    service = new UserService(repository);
  });

  describe('getById', () => {
    it('should call and return repository.findOne with id passed in param', async () => {
      const id = 'monId';
      const user = { name: 'toto' };
      repository.findOne = jest.fn().mockResolvedValue(user);

      const result = await service.getById(id);

      expect(result).toBe(user);
      expect(repository.findOne).toHaveBeenCalledWith(id);
    });
  });
});
