import { CommentRepository } from './comment.repository'
import { CommentService } from './comment.service'

describe('CommentService', () => {
  let service: CommentService
  let repository: CommentRepository

  beforeAll(async () => {
    repository = {} as any
    service = new CommentService(repository)
  })
  describe('getById', () => {
    it('Should call and return repository.findOne with id passed in param', async () => {
      const id = 'monId'
      const comment = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(comment)

      const result = await service.getById(id)

      expect(result).toBe(comment)
      expect(repository.findOne).toHaveBeenCalledWith(id)
    })
  })
})
