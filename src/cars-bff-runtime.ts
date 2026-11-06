// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import {
  createServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from 'node:http';

/** A function that returns one line of the hello world */
export type HelloSource = () => string;

/** The greeting of this package */
export const bffHello = 'Hello from cars-bff-runtime';

// .............................................................................
/**
 * The backend for frontend: answers the API calls of the browser.
 *
 * - `GET /api/hello` answers `{ lines: string[] }`, its own line first,
 *   then the line of each hello source
 * - `GET /health` answers `ok`
 */
export class CarsBffRuntime {
  /**
   * Creates the backend for frontend
   * @param _helloSources - Further lines of the hello world, in order
   */
  constructor(private readonly _helloSources: HelloSource[] = []) {}

  /** Example instance for test purposes */
  static get example(): CarsBffRuntime {
    return new CarsBffRuntime([() => 'Hello from an example source']);
  }

  /** The lines `GET /api/hello` answers */
  helloLines(): string[] {
    return [bffHello, ...this._helloSources.map((source) => source())];
  }

  /**
   * Answers one request
   * @param req - The incoming request
   * @param res - The response to write
   */
  handle(req: IncomingMessage, res: ServerResponse): void {
    const path = (req.url ?? '/').split('?')[0];

    if (req.method === 'GET' && path === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
      return;
    }

    if (req.method === 'GET' && path === '/api/hello') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ lines: this.helloLines() }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
  }

  /**
   * Starts an HTTP server
   * @param port - The port to listen on; 0 picks a free one
   * @returns The listening server
   */
  listen(port: number): Promise<Server> {
    const server = createServer((req, res) => this.handle(req, res));
    return new Promise((resolve) => {
      server.listen(port, () => resolve(server));
    });
  }
}
