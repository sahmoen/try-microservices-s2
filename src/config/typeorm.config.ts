import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sahmguban',
  database: 'user_api',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};
