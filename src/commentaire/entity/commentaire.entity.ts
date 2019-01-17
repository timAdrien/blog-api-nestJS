import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Commentaire {
  @PrimaryGeneratedColumn('uuid', { name: 'commentaire_id' })
  commentaireId: string

  @Column({ type: 'varchar', name: 'content' })
  content: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
