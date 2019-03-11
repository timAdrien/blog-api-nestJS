import { Body, Controller, Get, Put, HttpStatus, Param, UseGuards } from '@nestjs/common'
import { ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserNestService } from './user.service'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserNestUpdatePostInDto } from './dto/user-update-post-in.dto';

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

  @Put()
  @ApiResponse({ status: HttpStatus.OK, description: 'UserNest mis à jour' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'UserNest non trouvé :/',
  })
  async update(@Body() dto: UserNestUpdatePostInDto) {
    return this.userService.update(dto)
  }


  VERIFIER LA LISTE DES ISSUES ET LES INCLURES EN COMMENTANT DANS LA PULL REQUEST 
  CAR J'EN AI QUI SONT FAITE DEJA


}
