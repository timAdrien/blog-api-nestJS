import { ApiModelProperty } from '@nestjs/swagger'
import { UserNest } from '../../user/entity/user.entity'

export class ArticleDeleteInDto {
  @ApiModelProperty()
  readonly authorId: string

  @ApiModelProperty()
  readonly articleId: string
}
