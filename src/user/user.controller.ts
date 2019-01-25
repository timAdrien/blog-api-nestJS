import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { JwtAuthGuard } from '../auth/auth.guard'

@ApiUseTags('User')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
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
