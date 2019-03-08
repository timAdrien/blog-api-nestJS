import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserNest } from '../user/entity/user.entity'
import { UserNestService } from '../user/user.service'

export interface ISignIn {
  email: string
  password: string
}

export interface ISignUp {
  email: string
  firstName: string
  lastName: string
  mobilePhone: string
  password: string
}

export interface ITokenPayloadUnsigned {
  uid: string // user id
}

export interface ITokenPayload extends ITokenPayloadUnsigned {
  exp: number // inserted by jwt
  iat: number // inserted by jwt
}

@Injectable()
export class AuthService {
  /**
   * Determine whether a given `password` matches with a password
   * hash.
   *
   * @param password  Input password.
   * @param hash      Target user's password hash.
   *
   * @return `true` if the password matches with the hash, or `false`.
   */
  private static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash)
    } catch (err) {
      return false
    }
  }

  /**
   * Compute and return the hash of the given `password`.
   *
   * @param password Password to be hashed.
   * @returns Resolves with hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }
  constructor(
    private readonly userService: UserNestService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Log in a user with its email and password
   *
   * @param data
   * @returns Resolves with JWT auth token
   */
  public async signIn(data: ISignIn): Promise<{ token: string, userId: string }> {
    const user = await this.userService.getByEmail(data.email)

    if (!user) {
      throw new UnauthorizedException('Cannot find any user')
    }

    const isPasswordMatch = await AuthService.comparePassword(
      data.password,
      user.password
    )

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Cannot find any user')
    }

    return { token: this.createToken(user), userId: user.userId }
  }

  /**
   * Create new UserNest account and log in it
   *
   * @param data
   * @returns Resolves with JWT auth token
   */
  public async signUp(data: ISignUp): Promise<{ token: string }> {
    const user = await this.userService.create({
      ...data,
      password: await AuthService.hashPassword(data.password),
    })

    return { token: this.createToken(user) }
  }

  /**
   * Make sure the token is both valid:
   * - structurally (payload has all expected fields)
   * - in the database (must exist)
   *
   * @param payload Token payload.
   *
   * @return `true` if the token is valid and exists, or `false`.
   */
  async validateTokenPayload(
    payload: ITokenPayload
  ): Promise<UserNest | undefined> {
    if (!payload) {
      return
    }

    const user = await this.userService.getById(payload.uid)

    if (!user) {
      return
    }

    return user

    /*
        return moment(user.tokenBoundary).isBefore(1000 * payload.iat)
        ? user
        : undefined;
    */
  }

  /**
   * Generate a JWT token.
   *
   * @param user UserNest for whom the token is created.
   */
  private createToken(user: UserNest): string {
    const payload: ITokenPayloadUnsigned = {
      uid: user.userId,
    } as any
    return this.jwtService.sign(payload)
  }
}
