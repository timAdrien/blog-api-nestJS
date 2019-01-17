import { Module } from '@nestjs/common'
import { customRepository } from '../utils/custom-repository.tools'
import { DatabaseModule } from '../utils/database/database.module'
import { CommentaireController } from './commentaire.controller'
import { CommentaireRepository } from './commentaire.repository'
import { CommentaireService } from './commentaire.service'

@Module({
  imports: [DatabaseModule],
  controllers: [CommentaireController],
  providers: [CommentaireService, customRepository(CommentaireRepository)],
})
export class CommentaireModule {}
