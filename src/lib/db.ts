import { createConnection, getConnection } from 'typeorm';

import User from '../entities/User';
import Task from '../entities/Task';

let connectionReadyPromise: Promise<void> | null = null;

export function prepareConnection(): Promise<void> | null {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      // clean up old connection that references outdated hot-reload classes
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        // no stale connection to clean up
      }

      // wait for new default connection
      await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [User, Task],
        synchronize: true,
        logging: false,
      });
    })();
  }

  return connectionReadyPromise;
}
