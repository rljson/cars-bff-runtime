// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Server } from 'node:http';

import {
  CarsBffRuntime,
  HelloSource,
  masterSource,
} from './cars-bff-runtime.ts';

/** The port used when the environment sets none */
export const defaultPort = 3000;

/** The url of cars-master-runtime when the environment sets no `MASTER_URL` */
export const defaultMasterUrl = 'http://cars-master:3000';

/**
 * Starts the backend for frontend as the container runs it
 * @param env - The environment; `PORT` selects the port, `MASTER_URL` the
 *   url of cars-master-runtime
 * @param helloSources - Further lines of the hello world; by default those
 *   of cars-master-runtime
 * @param log - Where the start message goes
 * @returns The listening server
 */
export async function start(
  env: Record<string, string | undefined> = process.env,
  helloSources: HelloSource[] = [
    masterSource(env['MASTER_URL'] ?? defaultMasterUrl),
  ],
  log: (message: string) => void = console.log,
): Promise<Server> {
  const port = env['PORT'] ? Number(env['PORT']) : defaultPort;
  const server = await new CarsBffRuntime(helloSources).listen(port);
  log(`cars-bff-runtime listens on port ${port}`);
  return server;
}
