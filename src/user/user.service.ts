import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserNestRepository } from './user.repository'
import { UserNest } from './entity/user.entity'

@Injectable()
export class UserNestService {
  constructor(
    @Inject(UserNestRepository) private readonly userRepository: UserNestRepository
  ) {}

  /**
   * Update role and returns a user identified by its id
   *
   * @param data - user
   * @returns Resolves with UserNest
   */
  async specialRouteToSetFirstUserRoleForTests(idUser: string, role: string) {
    return this.userRepository.save(new UserNest({ userId: idUser, role: role }))
  }
  
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
    const user = await this.getById(data.userId)
    if (user) {
      // Set role to be sure no one is trying to update his role
      data.role = user.role
      
      return this.userRepository.save(data)
    } else {
      throw new UnauthorizedException('User not found for update')
    }
  }

  /**
   * Update role and returns a user identified by its id
   *
   * @param data - user
   * @returns Resolves with UserNest
   */
  async updateRoleUser(idAdmin: string, idUser: string, newRole: string) {
    const admin = await this.getById(idAdmin)
    if (admin && admin.role == 'Administrator') {
      return this.userRepository.save(new UserNest({ userId: idUser, role: newRole }))
    } else {
      throw new UnauthorizedException('Admin not found')
    }
  }
}