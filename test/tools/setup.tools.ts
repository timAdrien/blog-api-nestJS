import * as path from 'path'
import { createConnection, getConnection } from 'typeorm'

const ROOT_PATH = path.join(__dirname, '..', '..')

export interface ITypeORMModuleOptions {
  synchronize?: boolean
}

const setupDB = async () => {
  beforeAll(async () => {
    await initializeDB()
    global.console.log(getConnection().isConnected)
  })

  afterAll(async () => {
    await getConnection().close()
  })
}

const initializeDB = async (options: ITypeORMModuleOptions = {}) => {
  const synchronize = options.synchronize !== false
  return createConnection({
    database: process.env.DB_NAME,
    dropSchema: synchronize,
    entities: [`${ROOT_PATH}/**/*.entity{.ts,.js}`],
    host: process.env.DB_HOST,
    logger: 'advanced-console',
    logging: process.env.DB_DEBUG === 'true' ? ['query', 'error'] : [],
    name: 'default',
    password: process.env.DB_PWD,
    port: Number(process.env.DB_PORT),
    synchronize,
    type: 'postgres',
    username: process.env.DB_USER,
  })
}

export { setupDB }
