import { EntityRepository, Repository } from 'typeorm'
import { Commentaire } from './entity/commentaire.entity'

@EntityRepository(Commentaire)
export class CommentaireRepository extends Repository<Commentaire> {}
