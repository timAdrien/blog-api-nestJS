import { ApiModelProperty } from '@nestjs/swagger'
import { Comment } from '../../comment/entity/comment.entity'
import { UserNest } from '../../user/entity/user.entity'

export class ArticlePostInDto {
  @ApiModelProperty()
  readonly author: UserNest

  @ApiModelProperty()
  readonly comments: Comment[]

  @ApiModelProperty()
  readonly content: string

  @ApiModelProperty()
  readonly created: Date

  @ApiModelProperty()
  readonly dateLastToken: Date

  @ApiModelProperty()
  readonly disLikes: number

  @ApiModelProperty()
  readonly likes: number

  @ApiModelProperty()
  readonly picture: Buffer | File

  @ApiModelProperty()
  readonly title: string
}
