import { CommentaireController } from './commentaire.controller'
import { CommentaireService } from './commentaire.service'

describe('User Controller', () => {
  let controller: CommentaireController
  let service: CommentaireService

  beforeAll(async () => {
    service = {} as any
    controller = new CommentaireController(service)
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
})
