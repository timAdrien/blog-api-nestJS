import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { ArticleController } from './article.controller'
import { ArticleRepository } from './article.repository'
import { ArticleService } from './article.service'
import { UserNestModule } from '../user/user.module'
import { MailerModule, HandlebarsAdapter } from '@nest-modules/mailer'

@Module({
  imports: [DatabaseModule, UserNestModule,
    MailerModule.forRoot({
    transport: 'smtps://timothee.adrien@gmail.com:osgsumengzpwobqz@smtp.gmail.com',
    defaults: {
      from:'"nest-modules" <modules@nestjs.com>',
    }
  })],
  controllers: [ArticleController],
  providers: [ArticleService, customRepository(ArticleRepository)],
})
export class ArticleModule {}
