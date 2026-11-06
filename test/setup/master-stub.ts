// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { createServer, Server } from 'node:http';
import { AddressInfo } from 'node:net';

/** An HTTP server that answers GET /api/hello like cars-master-runtime */
export class CarsMasterStub {
  private constructor(
    private readonly _server: Server,
    readonly url: string,
  ) {}

  /**
   * Starts the stub on a free port
   * @param lines - The lines it answers
   * @returns The running stub
   */
  static async start(lines: string[]): Promise<CarsMasterStub> {
    const server = createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ lines }));
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    return new CarsMasterStub(server, `http://localhost:${port}`);
  }

  /** Stops the stub */
  close(): void {
    this._server.close();
  }
}
