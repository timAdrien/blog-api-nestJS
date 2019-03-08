import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsDefined } from 'class-validator'

export class SignInDto {
  @IsEmail()
  @IsDefined()
  @ApiModelProperty()
  email: string

  @IsString()
  @IsDefined()
  @ApiModelProperty()
  password: string
}
