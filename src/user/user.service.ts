import { Inject, Injectable } from '@nestjs/common'
import { UserNestRepository } from './user.repository'
import { UserNest } from './entity/user.entity'

@Injectable()
export class UserNestService {
  constructor(
    @Inject(UserNestRepository) private readonly userRepository: UserNestRepository
  ) {}

  /**
   * Create and returns a user identified by its id
   *
   * @param data - user
   * @returns Resolves with UserNest
   */
  async create(data: Partial<UserNest>) {
    return this.userRepository.save(new UserNest(data))
  }

  /**
   * Returns a user identified by its email
   *
   * @param email - user email
   * @returns Resolves with UserNest
   */
  async getByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }

  /**
   * Returns a user identified by its id
   *
   * @param id - user id
   * @returns Resolves with UserNest
   */
  async getById(id: string) {
    // User WHERE clause because else if not found it returns first row of table...
    return this.userRepository.findOne({ where: { userId: id }})
  }

  /**
   * Update and returns a user identified by its id
   *
   * @param data - user
   * @returns Resolves with UserNest
   */
  async update(data: Partial<UserNest>) {
    return this.userRepository.save(data)
  }
}
