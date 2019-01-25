import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { CommentController } from './comment.controller'
import { CommentRepository } from './comment.repository'
import { CommentService } from './comment.service'

@Module({
  imports: [DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService, customRepository(CommentRepository)],
})
export class CommentModule {}
