import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleModule } from './article/article.module'
import { CommentModule } from './comment/comment.module'
import { UserNestModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [UserNestModule, CommentModule, ArticleModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
