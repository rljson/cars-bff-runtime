// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';

import {
  bffHello,
  CarsBffRuntime,
  masterSource,
  noMaster,
} from '../src/cars-bff-runtime';

describe('CarsBffRuntime', () => {
  let server: Server | undefined;

  afterEach(() => {
    server?.close();
    server = undefined;
  });

  const call = async (bff: CarsBffRuntime, method: string, path: string) => {
    server = await bff.listen(0);
    const { port } = server.address() as AddressInfo;
    return fetch(`http://localhost:${port}${path}`, { method });
  };

  describe('helloLines()', () => {
    it('starts with its own line', async () => {
      expect(await new CarsBffRuntime().helloLines()).toEqual([bffHello]);
    });

    it('adds the lines of each source in order', async () => {
      expect(await CarsBffRuntime.example.helloLines()).toEqual([
        bffHello,
        'Hello from an example source',
      ]);
    });
  });

  describe('GET /api/hello', () => {
    it('answers the lines as json', async () => {
      const res = await call(CarsBffRuntime.example, 'GET', '/api/hello?x=1');
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/json');
      expect(await res.json()).toEqual({
        lines: [bffHello, 'Hello from an example source'],
      });
    });
  });

  describe('GET /health', () => {
    it('answers ok', async () => {
      const res = await call(new CarsBffRuntime(), 'GET', '/health');
      expect(res.status).toBe(200);
      expect(await res.text()).toBe('ok');
    });
  });

  describe('other requests', () => {
    it('answer 404 for an unknown path', async () => {
      const res = await call(new CarsBffRuntime(), 'GET', '/nope');
      expect(res.status).toBe(404);
    });

    it('answer 404 for another method', async () => {
      const res = await call(new CarsBffRuntime(), 'POST', '/api/hello');
      expect(res.status).toBe(404);
    });
  });

  describe('handle()', () => {
    it('treats a request without url as /', async () => {
      let status = 0;
      const res = {
        writeHead: (s: number) => (status = s),
        end: () => undefined,
      };
      await new CarsBffRuntime().handle(
        { method: 'GET' } as never,
        res as never,
      );
      expect(status).toBe(404);
    });
  });

  describe('masterSource()', () => {
    const answer = (body: unknown, ok = true) =>
      (async () => ({ ok, json: async () => body })) as never;

    it('answers the lines of cars-master-runtime', async () => {
      const urls: string[] = [];
      const fetchFn = (async (url: string) => {
        urls.push(url);
        return { ok: true, json: async () => ({ lines: ['a', 'b'] }) };
      }) as never;
      expect(await masterSource('http://master', fetchFn)()).toEqual([
        'a',
        'b',
      ]);
      expect(urls).toEqual(['http://master/api/hello']);
    });

    it('answers noMaster on an error status', async () => {
      expect(await masterSource('http://m', answer({}, false))()).toEqual([
        noMaster,
      ]);
    });

    it('answers noMaster when fetch fails', async () => {
      const fetchFn = (async () => {
        throw new Error('down');
      }) as never;
      expect(await masterSource('http://m', fetchFn)()).toEqual([noMaster]);
    });

    it('uses the global fetch by default', async () => {
      expect(await masterSource('http://localhost:1')()).toEqual([noMaster]);
    });
  });
});
