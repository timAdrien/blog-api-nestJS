import { EntityRepository, Repository } from 'typeorm'
import { UserNest } from './entity/user.entity'

@EntityRepository(UserNest)
export class UserNestRepository extends Repository<UserNest> {}
