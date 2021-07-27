// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Database } from 'arangojs';
import { DB_CONNECTION_TOKEN } from '@ait/shared';

export const databaseProviders = (environment: any) => {
  return [
    {
      provide: DB_CONNECTION_TOKEN,
      useFactory: () => {
        const db = new Database({
          url: environment.DATABASE.HOST,
          databaseName: environment.DATABASE.NAME,
          auth: {
            username: environment.DATABASE.USER,
            password: environment.DATABASE.PASS,
          },
        });
        return db;
      },
    },
  ];
}
