import { Inject, Injectable } from '@nestjs/common'
import { ArticleRepository } from './article.repository'
import { Article } from './entity/article.entity'

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ArticleRepository)
    private readonly articleRepository: ArticleRepository
  ) {}

  /**
   * Returns a article identified
   *
   * @param article - article
   * @returns Resolves with Article
   */
  async create(data: Partial<Article>) {
    return this.articleRepository.save(new Article(data))
  }

  /**
   * Returns a article identified
   *
   * @param articles - articles
   * @returns Resolves with Article
   */
  async saveList(data: Partial<Article>[]) {
    return this.articleRepository.save(data)
  }
  
  /**
   * Returns a article identified by its id
   *
   * @param id - article id
   * @returns Resolves with Article
   */
  async getById(id: string) {
    let articleToReturn = null
    articleToReturn = await this.articleRepository.findOne(id)
    if (articleToReturn && articleToReturn.author) {
      // Données confidentielles
      articleToReturn.author.created = ''
      articleToReturn.author.updated = ''
      articleToReturn.author.password = ''
    }
    return articleToReturn
  }

  /**
   * Returns a article identified by its id
   *
   * @param id - article id
   * @returns Resolves with Article
   */
  async getByTitle(title: string) {
    let articleToReturn = null
    articleToReturn = await this.articleRepository.findOne({ where: { title } })
    if (articleToReturn && articleToReturn.author) {
      // Données confidentielles
      articleToReturn.author.created = ''
      articleToReturn.author.updated = ''
      articleToReturn.author.password = ''
    }
    return articleToReturn
  }

  /**
   * Returns a article identified by its id
   *
   * @param id - article id
   * @returns Resolves with Article
   */
  async getAllPagined(step: number) {
    return this.articleRepository.find({
      take: 20,
      skip: step * 20
    })
  }
  
  /**
   * Returns a article identified
   *
   * @param article - article
   * @returns Resolves with Article
   */
  /*
  async updateById(article: ArticlePostInDto) {
    return this.articleRepository.save({}...ArticlePostInDto})
  }
  */
}
