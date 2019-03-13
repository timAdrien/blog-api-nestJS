import { ApiModelProperty } from '@nestjs/swagger'
import { UserNest } from '../../user/entity/user.entity'

export class ArticlePutInDto {
  @ApiModelProperty()
  readonly author: UserNest

  @ApiModelProperty()
  readonly articleId: string

  @ApiModelProperty()
  readonly content: string

  @ApiModelProperty()
  readonly title: string
}
