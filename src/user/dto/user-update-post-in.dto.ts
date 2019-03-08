import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsDefined, MaxLength, IsMobilePhone, IsUUID } from 'class-validator'

export class UserNestUpdatePostInDto {

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

  @IsMobilePhone('fr-FR')
  @IsDefined()
  @MaxLength(31)
  @ApiModelProperty()
  mobilePhone: string

  @IsUUID()
  @IsDefined()
  @ApiModelProperty()
  userId: string
}
