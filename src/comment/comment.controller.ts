import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiUseTags } from '@nestjs/swagger'
import { CommentService } from './comment.service'

@ApiUseTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Comment trouvé' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment non trouvé :/',
  })
  async getById(@Param('id') id: string) {
    return this.commentService.getById(id)
  }
}
