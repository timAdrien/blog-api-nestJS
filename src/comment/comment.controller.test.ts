import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

describe('Comment Controller', () => {
  let controller: CommentController
  let service: CommentService

  beforeAll(async () => {
    service = {} as any
    controller = new CommentController(service)
  })

  describe('getById', () => {
    it('should return the result of service.getById', async () => {
      const id = 'monId'
      const comment = { name: 'toto' }
      service.getById = jest.fn().mockResolvedValue(comment)

      const result = await controller.getById(id)

      expect(result).toBe(comment)
      expect(service.getById).toHaveBeenCalledWith(id)
    })
  })
})
