import { HOST, PORT } from './constants.js';
import 'reflect-metadata';
import type { Server } from 'node:http';
import { dbVirtualOffice, initDB } from './db/index.js';
import app from './app.js';

let server: Server | undefined;
let isShuttingDown = false;

async function start() {
  await initDB();

  await new Promise<void>((resolve, reject) => {
    server = app.listen(PORT, HOST, (error?: Error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  if (server) {
    const result = server.address();
    const address = typeof result === 'object' ? result : null;

    console.log(
      `Server running on http://${address?.address || HOST}:${String(address?.port || PORT)} (${String(address?.family)})`,
    );
    server.on('close', () => {
      console.log('HTTP server closed');
    });
  }
}

async function handleStartupFailure(error: unknown) {
  console.error('Server startup failed:', error);
  try {
    if (dbVirtualOffice.isInitialized) await dbVirtualOffice.destroy();
  } catch (cleanupError) {
    console.error(
      'Error closing database after startup failure:',
      cleanupError,
    );
  }
  process.exit(1);
}

start().catch((error: unknown) => {
  void handleStartupFailure(error);
});

const closeHttpServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.closeIdleConnections();

    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });

    setTimeout(() => {
      server?.closeAllConnections();
    }, 5000).unref();
  });
};

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\nReceived ${signal}.`);
  console.log('Shutting down server gracefully...');

  try {
    await closeHttpServer();

    if (dbVirtualOffice.isInitialized) {
      await dbVirtualOffice.destroy();
      console.log('Database connection closed');
    }

    console.log('Shutting down server gracefully... Done');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtExceptionMonitor', (error) => {
  console.error('Uncaught exception (monitor):', error);
});

process.on('unhandledRejectionMonitor', (reason) => {
  console.error('Unhandled rejection (monitor):', reason);
});
