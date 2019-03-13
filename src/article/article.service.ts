import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ArticleRepository } from './article.repository'
import { Article } from './entity/article.entity'
import { UserNestService } from '../user/user.service'

@Injectable()
export class ArticleService {
  constructor(
    @Inject(ArticleRepository)
    private readonly articleRepository: ArticleRepository,
    private readonly userService: UserNestService
  ) {}

  /**
   * Returns a article created
   *
   * @param article - article
   * @returns Resolves with Article
   */
  async create(data: Partial<Article>) {
    return this.articleRepository.save(data)
  }

  /**
   * Returns a article updated
   *
   * @param article - article
   * @returns Resolves with Article
   */
  async update(data: Partial<Article>, idAuthor: string) {
    const author = await this.userService.getById(idAuthor)
    if (author && author.role == 'Author') {
      return this.articleRepository.save(data)
    } else {
      throw new UnauthorizedException('You cannot edit this article')
    }
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
    let articleToReturn = await this.articleRepository.findOne(id)
    if (articleToReturn && articleToReturn.author) {
      // Données confidentielles
      articleToReturn.author.created = null
      articleToReturn.author.updated = null
      articleToReturn.author.password = null
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
    let articleToReturn = await this.articleRepository.findOne({ where: { title } })
    if (articleToReturn && articleToReturn.author) {
      // Données confidentielles
      articleToReturn.author.created = null
      articleToReturn.author.updated = null
      articleToReturn.author.password = null
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
   * Returns a article identified by its id
   *
   * @param id - article id
   * @returns Resolves with Article
   */
  async getAllArticlesByAuthorId(idAuthor: string) {
    const author = await this.userService.getById(idAuthor)
    if(author) {
      return this.articleRepository.find({
        where : {
          author: author
        }
      })
    } else {
      throw new UnauthorizedException('Author not found')
    }
  }
  
  /**
   * Returns a article identified by its id
   *
   * @param id - article id
   * @returns Resolves with Article
   */
  async delete(idArticle: string, idAuthor: string) {
    const author = await this.userService.getById(idAuthor)
    if(author && author.role == "Author") {
      return this.articleRepository.delete(idArticle)
    } else {
      throw new UnauthorizedException('You cannot remove this article')
    }
  }
}
