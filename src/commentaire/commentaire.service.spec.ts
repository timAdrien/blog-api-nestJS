import { CommentaireRepository } from './commentaire.repository'
import { CommentaireService } from './commentaire.service'

describe('UserService', () => {
  let service: CommentaireService
  let repository: CommentaireRepository

  beforeAll(async () => {
    repository = {} as any
    service = new CommentaireService(repository)
  })
  describe('getById', () => {
    it('Should call and return repository.findOne with id passed in param', async () => {
      const id = 'monId'
      const user = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(user)

      const result = await service.getById(id)

      expect(result).toBe(user)
      expect(repository.findOne).toHaveBeenCalledWith(id)
    })
  })
})
