import { Connection, getCustomRepository, Repository } from 'typeorm';

/**
 * Generate the custom repository provider of a class
 * that extends Repository<>
 *
 * @param repositoryClass - Custom Repository Class
 * @returns - Resolves with the repository provider generated, its token is the repositoryClass.name
 */
export function customRepository(repositoryClass: new () => Repository<any>) {
  return {
    provide: repositoryClass.name,
    useFactory: async (connection: Connection) =>
      await getCustomRepository(repositoryClass),
    inject: ['PostgresConnection'],
  };
}
