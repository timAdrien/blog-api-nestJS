import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiUseTags } from '@nestjs/swagger'
import { CommentaireService } from './commentaire.service'

@ApiUseTags('User')
@Controller('user')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'User trouvé' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Commentaire non trouvé :/',
  })
  async getById(@Param('id') id: string) {
    return this.commentaireService.getById(id)
  }
}
