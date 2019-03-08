import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { configService } from '../config/config.service'
import { UnauthorizedException, Injectable } from '@nestjs/common'
import { AuthService, ITokenPayload } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getString('SECRET_KEY'),
    })
  }

  async validate(payload: ITokenPayload) {
    const user = await this.authService.validateTokenPayload(payload)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
