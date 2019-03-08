import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsDefined, MaxLength, IsMobilePhone } from 'class-validator'

export class SignUpDto {
  @IsEmail()
  @IsDefined()
  @ApiModelProperty()
  email: string

  @IsString()
  @IsDefined()
  @MaxLength(31)
  @ApiModelProperty()
  firstName: string

  @IsEmail()
  @IsDefined()
  @MaxLength(31)
  @ApiModelProperty()
  lastName: string

  @IsMobilePhone('fr_FR')
  @IsDefined()
  @MaxLength(31)
  @ApiModelProperty()
  mobilePhone: string

  @IsString()
  @IsDefined()
  @ApiModelProperty()
  password: string
}
