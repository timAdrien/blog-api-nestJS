import { Inject, Injectable } from '@nestjs/common'
import { CommentRepository } from './comment.repository'

@Injectable()
export class CommentService {
  constructor(
    @Inject(CommentRepository) private readonly commentRepository: CommentRepository
  ) {}

  /**
   * Returns a comment identified by its id
   *
   * @param id - comment id
   * @returns Resolves with Comment
   */
  async getById(id: string) {
    return this.commentRepository.findOne(id)
  }
}
