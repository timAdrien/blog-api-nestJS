import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, customRepository(UserRepository)],
  exports: [UserService]
})
export class UserModule {}
