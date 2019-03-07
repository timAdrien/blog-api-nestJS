import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserNestService } from './user.service'
import { JwtAuthGuard } from '../auth/auth.guard'

@ApiUseTags('UserNest')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
@Controller('user')
export class UserNestController {
  constructor(private readonly userService: UserNestService) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'UserNest trouvé' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UserNest non trouvé :/',
  })
  async getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }
}
