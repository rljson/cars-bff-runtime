// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';

import { defaultPort, start } from '../src/start';

describe('start()', () => {
  let server: Server | undefined;

  afterEach(() => {
    server?.close();
    server = undefined;
  });

  it('listens on PORT and serves the given sources', async () => {
    const messages: string[] = [];
    server = await start({ PORT: '0' }, [() => 'Hello from a source'], (m) =>
      messages.push(m),
    );
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://localhost:${port}/api/hello`);
    expect((await res.json()).lines).toContain('Hello from a source');
    expect(messages).toEqual(['cars-bff-runtime listens on port 0']);
  });

  it('uses the default port without PORT', async () => {
    const messages: string[] = [];
    server = await start({}, [], (m) => messages.push(m));
    expect((server.address() as AddressInfo).port).toBe(defaultPort);
  });

  it('defaults to process.env, the master line and console.log', async () => {
    const log = console.log;
    const messages: string[] = [];
    console.log = (m: string) => messages.push(m);
    const before = process.env['PORT'];
    process.env['PORT'] = '0';
    try {
      server = await start();
    } finally {
      console.log = log;
      if (before === undefined) delete process.env['PORT'];
      else process.env['PORT'] = before;
    }
    expect(messages).toEqual(['cars-bff-runtime listens on port 0']);
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://localhost:${port}/api/hello`);
    expect((await res.json()).lines).toEqual([
      'Hello from cars-bff-runtime',
      'Hello from cars-master-runtime',
    ]);
  });
});
