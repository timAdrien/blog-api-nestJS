import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { ArticleController } from './article.controller'
import { ArticleRepository } from './article.repository'
import { ArticleService } from './article.service'
import { UserNestModule } from '../user/user.module'

@Module({
  imports: [DatabaseModule, UserNestModule],
  controllers: [ArticleController],
  providers: [ArticleService, customRepository(ArticleRepository)],
})
export class ArticleModule {}
