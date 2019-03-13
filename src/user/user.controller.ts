import { Body, Controller, Get, Put, Post, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserNestService } from './user.service'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserNestUpdatePutInDto } from './dto/user-update-put-in.dto'
import { UserNest } from './entity/user.entity';
import { UserNestUpdateRolePutInDto } from './dto/user-update-role-put-in.dto'

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

  @Get('getAll/:adminId')
  @ApiResponse({ status: HttpStatus.OK, description: 'UserNest trouvé' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UserNest non trouvé :/',
  })
  async getAll(@Param('adminId') adminId: string) {
    return this.userService.getAll(adminId)
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, description: 'UserNest mis à jour' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UserNest non mis à jour :/',
  })
  async update(@Body() dto: UserNestUpdatePutInDto) {
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

  @Put('updateRole')
  @ApiResponse({ status: HttpStatus.OK, description: 'Role user mis à jour' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Role user non mis à jour :/',
  })
  async updateRoleUser(@Body() dto: UserNestUpdateRolePutInDto) {
    return this.userService.updateRoleUser(dto)
  }
}
