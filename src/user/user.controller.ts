import { Controller, Get, HttpStatus, Param } from '@nestjs/common'
import { ApiResponse, ApiUseTags } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiUseTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'User trouvé' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User non trouvé :/',
  })
  async getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }
}
