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

/** A function that returns further lines of the hello world */
export type HelloSource = () => Promise<string[]>;

/** The line shown when cars-master-runtime does not answer */
export const noMaster = 'No answer from cars-master-runtime';

/** How long masterSource() waits for cars-master-runtime, in milliseconds */
export const masterTimeoutMs = 2000;

/**
 * Asks cars-master-runtime over HTTP for its hello lines
 * @param masterUrl - The base url of cars-master-runtime
 * @param fetchFn - The fetch to use
 * @param timeoutMs - How long to wait for the answer
 * @returns A hello source that answers the lines of `GET <masterUrl>/api/hello`,
 *   or {@link noMaster} when there is no answer in time
 */
export function masterSource(
  masterUrl: string,
  fetchFn: typeof fetch = fetch,
  timeoutMs: number = masterTimeoutMs,
): HelloSource {
  return async () => {
    try {
      const res = await fetchFn(`${masterUrl}/api/hello`, {
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) return [noMaster];
      const { lines } = (await res.json()) as { lines: string[] };
      return lines;
    } catch {
      return [noMaster];
    }
  };
}

/** The greeting of this package */
export const bffHello = 'Hello from cars-bff-runtime';

// .............................................................................
/**
 * The backend for frontend: answers the API calls of the browser.
 *
 * - `GET /api/hello` answers `{ lines: string[] }`, its own line first,
 *   then the lines of each hello source
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
    return new CarsBffRuntime([
      async () => ['Hello from an example source'],
    ]);
  }

  /** The lines `GET /api/hello` answers */
  async helloLines(): Promise<string[]> {
    const further = await Promise.all(
      this._helloSources.map((source) => source()),
    );
    return [bffHello, ...further.flat()];
  }

  /**
   * Answers one request
   * @param req - The incoming request
   * @param res - The response to write
   */
  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const path = (req.url ?? '/').split('?')[0];

    if (req.method === 'GET' && path === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
      return;
    }

    if (req.method === 'GET' && path === '/api/hello') {
      const lines = await this.helloLines();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ lines }));
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
