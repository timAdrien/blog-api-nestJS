import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { ArticleController } from './article.controller'
import { ArticleRepository } from './article.repository'
import { ArticleService } from './article.service'
import { UserNestModule } from '../user/user.module'
import { MailerModule } from '@nest-modules/mailer'
import { FunctionUtils } from '../utils/functions'

@Module({
  imports: [DatabaseModule, UserNestModule,
    MailerModule.forRoot(FunctionUtils.getOptionsMailer())],
  controllers: [ArticleController],
  providers: [ArticleService, customRepository(ArticleRepository)],
})
export class ArticleModule {}
