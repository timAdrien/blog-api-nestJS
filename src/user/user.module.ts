import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { UserNestController } from './user.controller'
import { UserNestRepository } from './user.repository'
import { UserNestService } from './user.service'

@Module({
  imports: [DatabaseModule],
  controllers: [UserNestController],
  providers: [UserNestService, customRepository(UserNestRepository)],
  exports: [UserNestService]
})
export class UserNestModule {}
