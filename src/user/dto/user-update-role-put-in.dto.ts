import { ApiModelProperty } from '@nestjs/swagger'
import { IsString, IsDefined, IsUUID } from 'class-validator'

export class UserNestUpdateRolePutInDto {
  @IsUUID()
  @IsDefined()
  @ApiModelProperty()
  adminId: string

  @IsUUID()
  @IsDefined()
  @ApiModelProperty()
  userId: string

  @IsString()
  @IsDefined()
  @ApiModelProperty()
  newRole: string
}
