import { ApiModelProperty } from '@nestjs/swagger'
import { IsDefined, IsUUID } from 'class-validator'

export class UserDeleteInDto {
  @IsUUID()
  @IsDefined()
  @ApiModelProperty()
  adminId: string

  @IsUUID()
  @IsDefined()
  @ApiModelProperty()
  userId: string
}
