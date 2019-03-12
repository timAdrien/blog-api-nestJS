import { UserNest } from '../user/entity/user.entity'
import { ArticleRepository } from './article.repository'
import { ArticleService } from './article.service'
import { Article } from './entity/article.entity'

describe('ArticleService', () => {
  let service: ArticleService
  let repository: ArticleRepository

  beforeAll(() => {
    repository = {} as any
    service = new ArticleService(repository)
  })

  describe('create', () => {
    it('Should call and return repository.create with article passed in param', async () => {
      const newArticle = new Article({
        title: 'Mon super article',
        content: 'Wallah quel super article',
        likes: 5,
        disLikes: 1,
        author: new UserNest({ firstName: 'Tim', lastName: 'Ad' }),
      })

      repository.save = jest.fn().mockResolvedValue(newArticle)

      const result = await service.create(newArticle)

      expect(result).toBe(newArticle)
      expect(repository.save).toHaveBeenCalledWith(newArticle)
    })
  })

  describe('getById', () => {
    it('Should call and return repository.findOne with id passed in param', async () => {
      const id = 'uid'
      const user = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(user)

      const result = await service.getById(id)

      expect(result).toBe(user)
      expect(repository.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('getByTitle', () => {
    it('Should call and return repository.findOne with title passed in param', async () => {
      const title = 'article 1'
      const user = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(user)

      const result = await service.getByTitle(title)

      expect(result).toBe(user)
      expect(repository.findOne).toHaveBeenCalledWith({ where: { title } })
    })
  })

  describe('getAllPagined', () => {
    it('Should call and return repository.find with step passed in param', async () => {
      let lstArticles = []
      let i: number
      let authorOfArticles = new UserNest()
      const step = 2

      for (i = 0; i < 60; i++) {
        lstArticles.push(new Article({ title: 'Article ' + i, author: authorOfArticles }))
      }

      const lstPagined = lstArticles.slice(20, 40)

      repository.find = jest.fn().mockResolvedValue(lstPagined)

      const result = await service.getAllPagined(step)

      expect(result).toBe(lstPagined)
      expect(repository.find).toHaveBeenCalledWith({ skip: step * 20, take: 20 })
    })
  })
})
