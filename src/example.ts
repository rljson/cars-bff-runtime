// @license
// Copyright (c) 2026 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { CarsBffRuntime } from './cars-bff-runtime.ts';

export const example = () => {
  const l = console.log;

  l('CarsBffRuntime.example.helloLines()');
  for (const line of CarsBffRuntime.example.helloLines()) {
    l(`  ${line}`);
  }
};

/*
// Run via "npx vite-node src/example.ts"
example();
*/
