import { createConnection } from 'typeorm'
import { ConfigService } from './../../config/config.service'

export const databaseProviders = [
  {
    provide: 'PostgresConnection',
    useFactory: async (configService: ConfigService) =>
      createConnection({
        type: 'postgres',
        host: configService.getString('DB_HOST'),
        port: configService.getNumber('DB_PORT'),
        username: configService.getString('DB_USER'),
        password: configService.getString('DB_PWD'),
        database: configService.getString('DB_NAME'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    inject: [ConfigService],
  },
]
