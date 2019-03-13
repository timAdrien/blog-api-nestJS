import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsString, IsDefined, MaxLength, IsMobilePhone, IsUUID, IsBase64 } from 'class-validator'

export class UserNestUpdatePutInDto {

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

  @IsBase64()
  @IsDefined()
  @ApiModelProperty()
  picture: string
}
