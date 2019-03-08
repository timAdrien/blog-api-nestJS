import { Module } from '@nestjs/common'
import { UserNestModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { configService } from '../config/config.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserNestModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: configService.getString('SECRET_KEY'),
      signOptions: {
        expiresIn: configService.getNumber('DEFAULT_EXPIRATION'),
        algorithm: configService.getString('AUTH_ALGORITHM'),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
