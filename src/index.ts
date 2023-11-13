import { AddressInfo } from 'net';
import http from 'http';

import Table from 'cli-table3';

import config from './config';
import app from './app';

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val: any) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(config.app.port || '3000');
app.set('port', port);

/**
 * Event listener for HTTP server "listening" event.
 */

async function bootstrap() {
  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
  server.on('listening', () => {
    const addressInfo: AddressInfo = <AddressInfo>server.address();
    console.log(`Listening on ${addressInfo.address}:${port}`);
  });
  await server.listen(port);

  /* List routes */
  const existingRoutes: [] = app._router.stack
    .map((routeObj) => {
      if (routeObj.route) {
        return [
          routeObj.route?.stack[0].method.toUpperCase(),
          routeObj.route?.path,
        ];
      } else {
        return undefined;
      }
    })
    .filter((item) => item !== undefined)
    .reduce(
      (uniques, item) =>
        uniques.find((unique) => unique[0] == item[0] && unique[1] == item[1])
          ? uniques
          : [...uniques, item],
      [],
    );
  const table = new Table({
    head: ['Method', 'Route'],
  });
  existingRoutes.forEach((route) => table.push(route));
  console.log(table.toString());

  process
    .on('SIGINT', () => {
      console.log('Server gracefully shut down!');
      process.exit(1);
    })
    .on('unhandledRejection', (error: Error) => {
      console.log(`Unhandled Promise Rejection, reason: ${error.message}`);
      console.log(error.stack);
    })
    .on('uncaughtException', (error: Error) => {
      console.log(`Unhandled Exception, reason: ${error.message}`);
      console.log(error.stack);
    });
}
bootstrap();
