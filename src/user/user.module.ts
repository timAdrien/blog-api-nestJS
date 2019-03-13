import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { UserNestController } from './user.controller'
import { UserNestRepository } from './user.repository'
import { UserNestService } from './user.service'
import { MailerModule } from '@nest-modules/mailer'
import { FunctionUtils } from '../utils/functions'

@Module({
  imports: [DatabaseModule, MailerModule.forRoot(FunctionUtils.getOptionsMailer())],
  controllers: [UserNestController],
  providers: [UserNestService, customRepository(UserNestRepository)],
  exports: [UserNestService]
})
export class UserNestModule {}
