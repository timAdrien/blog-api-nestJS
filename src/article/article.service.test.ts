import { UserNest } from '../user/entity/user.entity'
import { ArticleRepository } from './article.repository'
import { ArticleService } from './article.service'
import { Article } from './entity/article.entity'
import { UserNestService } from '../user/user.service';
import { UserNestRepository } from '../user/user.repository';

describe('ArticleService', () => {
  let service: ArticleService
  let userService: UserNestService
  let userRepo: UserNestRepository
  let repository: ArticleRepository

  beforeAll(() => {
    repository = {} as any
    userRepo = {} as any
    userService = new UserNestService(userRepo)
    service = new ArticleService(repository, userService)
  })

  describe('create', async () => {
    it('Should call and return repository.create with article passed in param', async () => {
      const newArticle = new Article({
        title: 'Mon super article',
        content: 'Damn quel super article',
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

  describe('getById', async () => {
    it('Should call and return repository.findOne with id passed in param', async () => {
      const id = 'uid'
      const user = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(user)

      const result = await service.getById(id)

      expect(result).toBe(user)
      expect(repository.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('getByTitle', async () => {
    it('Should call and return repository.findOne with title passed in param', async () => {
      const title = 'article 1'
      const user = { name: 'toto' }
      repository.findOne = jest.fn().mockResolvedValue(user)

      const result = await service.getByTitle(title)

      expect(result).toBe(user)
      expect(repository.findOne).toHaveBeenCalledWith({ where: { title } })
    })
  })

  describe('getAllPagined', async () => {
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

  describe('getAllArticlesByAuthorId', async () => {
    it('Should call and return repository.find with author id passed in param', async () => {
      const author1Id = 'authorId'
      let lstArticles = []
      let lstArticles2 = []
      let i: number
      let authorOfArticles = new UserNest()
      let author2OfArticles = new UserNest()

      for (i = 0; i < 10; i++) {
        lstArticles.push(new Article({ title: 'Article ' + i + 10, author: authorOfArticles }))
      }

      for (i = 0; i < 5; i++) {
        lstArticles2.push(new Article({ title: 'Article ' + i, author: author2OfArticles }))
      }

      repository.find = jest.fn().mockResolvedValue(lstArticles)
      userService.getById = jest.fn().mockResolvedValue(authorOfArticles)
      
      const result = await service.getAllArticlesByAuthorId(author1Id)

      expect(result).toBe(lstArticles)
    })
  })
  
  describe('delete article', async () => {
    it('Should call repository.delete with article id passed in param', async () => {
      let authorOfArticles = new UserNest({ role: 'Author' })
      
      repository.delete = jest.fn().mockResolvedValue({})
      userService.getById = jest.fn().mockResolvedValue(authorOfArticles)
      
      const result = await service.delete('articleId', 'authorId')

      expect(result).toEqual({})
      expect(repository.delete).toHaveBeenCalledWith('articleId')
      expect(userService.getById).toHaveBeenCalledWith('authorId')
    })
  })
})
