import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { Comment } from '../comment/entity/comment.entity'
import { UserNest } from '../user/entity/user.entity';
import { Article } from './entity/article.entity';

describe('Article Controller', () => {
  let controller: ArticleController
  let service: ArticleService
  const titleArticle = 'Mon article de test'

  beforeAll(async () => {
    service = {} as any
    controller = new ArticleController(service)
  })

  describe('Create article', () => {
    it('should create article', async () => {
      const article = {
        title: titleArticle,
        content: 'Content article test',
      }

      service.create = jest.fn().mockResolvedValue(article)

      const result = await service.create(article)

      expect(result).toBe(article)
      expect(service.create).toHaveBeenCalledWith(article)
    })
  })

  describe('getByTitle Article', () => {
    it('should return the result of service.getByTitle', async () => {
      const article = {
        title: titleArticle,
        comments: [
          new Comment({ content: 'blabla' }),
          new Comment({ content: 'blabla 2' }),
        ],
      }
      service.getByTitle = jest.fn().mockResolvedValue(article)

      const result = await controller.getByTitle(titleArticle)

      expect(result).toBe(article)
      expect(service.getByTitle).toHaveBeenCalledWith(titleArticle)
    })
  })

  describe('getById Article', () => {
    it('should return the result of service.getById', async () => {
      const id = 'monId'
      const article = { title: 'toto' }
      service.getById = jest.fn().mockResolvedValue(article)

      const result = await controller.getById(id)

      expect(result).toBe(article)
      expect(service.getById).toHaveBeenCalledWith(id)
    })
  })

  describe('getAllPagined', () => {
    it('Should call and return service.getAllPagined with step passed in param', async () => {
      let lstArticles = []
      let i: number
      let authorOfArticles = new UserNest()
      const step = 2

      for (i = 0; i < 60; i++) {
        lstArticles.push(new Article({ title: 'Article ' + i, author: authorOfArticles }))
      }

      const lstPagined = lstArticles.slice(20, 40)

      service.getAllPagined = jest.fn().mockResolvedValue(lstPagined)

      const result = await controller.getAllPagined(step)

      expect(result).toBe(lstPagined)
      expect(service.getAllPagined).toHaveBeenCalledWith(step)
    })
  })
})
