import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common'
import { ApiResponse, ApiUseTags } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { ArticlePostInDto } from './dto/article-post-in.dto'
import { ArticlePutInDto } from './dto/article-put-in.dto';

@ApiUseTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  @ApiResponse({ status: HttpStatus.OK, description: 'Article créé.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur est survenue dans la création de l\'article.',
  })
  async create(@Body() article: ArticlePostInDto) {
    return this.articleService.create(article)
  }

  @Post('saveList')
  @ApiResponse({ status: HttpStatus.OK, description: 'Article créé.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur est survenue dans la création de l\'article.',
  })
  async saveList(@Body() articles: ArticlePostInDto[]) {
    return this.articleService.saveList(articles)
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Article trouvé.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article non trouvé :/'
  })
  async getById(@Param('id') id: string) {
    return this.articleService.getById(id)
  }

  @Get('get_by_title/:title')
  @ApiResponse({ status: HttpStatus.OK, description: 'Article trouvé.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article non trouvé :/'
  })
  async getByTitle(@Param('title') title: string) {
    return this.articleService.getByTitle(title)
  }

  @Get('page/:step')
  @ApiResponse({ status: HttpStatus.OK, description: 'Articles trouvés.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Articles non trouvés :/'
  })
  async getAllPagined(@Param('step') step: string) {
    return this.articleService.getAllPagined(parseInt(step))
  }

  @Get('author/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Articles trouvés.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Articles non trouvés :/'
  })
  async getAllArticlesByAuthorId(@Param('id') id: string) {
    return this.articleService.getAllArticlesByAuthorId(id)
  }

  @Put('update')
  @ApiResponse({ status: HttpStatus.OK, description: 'Article mis à jour.' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Une erreur est survenue dans la mise à jour de l\'article.',
  })
  async update(@Body() data: ArticlePutInDto) {
    return this.articleService.update(data, data.author.userId)
  }
}
