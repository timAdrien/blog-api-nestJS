import { Body, Controller, Get, Put, Post, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserNestService } from './user.service'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserNestUpdatePostInDto } from './dto/user-update-post-in.dto';
import { UserNest } from './entity/user.entity';

@ApiUseTags('UserNest')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
@Controller('user')
export class UserNestController {
  constructor(private readonly userService: UserNestService) {}

  @Post('TestRoute_setRoleUser')
  async specialRouteToSetFirstUserRoleForTests(@Body() dto: { userId: string, role: string }) {
    return this.userService.specialRouteToSetFirstUserRoleForTests(dto.userId, dto.role)
  }
  
  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'UserNest trouvé' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UserNest non trouvé :/',
  })
  async getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, description: 'UserNest mis à jour' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UserNest non mis à jour :/',
  })
  async update(@Body() dto: UserNestUpdatePostInDto) {
    let userNest = new UserNest({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      mobilePhone: dto.mobilePhone,
      userId: dto.userId,
      picture: dto.picture ? Buffer.from(dto.picture) : undefined
    })

    return this.userService.update(userNest)
  }
}
