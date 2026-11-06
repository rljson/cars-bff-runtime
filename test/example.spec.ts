// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { describe, it } from 'vitest';

import { example } from '../src/example';

import { expectGolden } from './setup/goldens';

describe('example', () => {
  it('prints the hello lines', async () => {
    const logMessages: string[] = [];
    const log = console.log;
    console.log = (message: string) => logMessages.push(message);
    await example();
    console.log = log;

    await expectGolden('example.log').toBe(logMessages.join('\n'));
  });
});
