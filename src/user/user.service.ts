import { Inject, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { User } from './entity/user.entity'

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  /**
   * Returns a user identified by its id
   *
   * @param id - user id
   * @returns Resolves with User
   */
  async create(data: Partial<User>) {
    return this.userRepository.save(new User(data))
  }

  /**
   * Returns a user identified by its email
   *
   * @param email - user email
   * @returns Resolves with User
   */
  async getByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  /**
   * Returns a user identified by its id
   *
   * @param id - user id
   * @returns Resolves with User
   */
  async getById(id: string) {
    return this.userRepository.findOne(id)
  }
}
