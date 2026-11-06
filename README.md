<!--
@license
Copyright (c) rljson

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# @rljson/cars-bff-runtime

English | [Deutsch](README.de.md)

[![CI](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml/badge.svg)](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml)
[![npm](https://img.shields.io/npm/v/@rljson/cars-bff-runtime.svg)](https://www.npmjs.com/package/@rljson/cars-bff-runtime)

Backend for frontend of the cars example app: serves the API of the browser.

## Motivation

- The browser talks to one backend only, which gathers what the domains answer
- It runs as the container `cars-server` and links the domain runtimes as packages
- For now it answers the hello world: its own line and those of further sources

## Installation

```bash
pnpm add @rljson/cars-bff-runtime
```

## Usage

```ts
import { start } from '@rljson/cars-bff-runtime';

await start({ PORT: '3000' }, [() => 'Hello from a source']);
```

It prints:

```text
cars-bff-runtime listens on port 3000
```

## Container

Build the container `cars-server` in the registry:

```bash
az acr build --registry crcarsdemo --image cars-server:<version>-<sha> .
```

## Limitations

- Answers only `/api/hello` and `/health`
- No sign-in yet

## Documentation

- The guides in [doc/guides](doc/guides)

## Status

Before 1.0 — the API may change between minor versions.

## Contributing

See [doc/guides/develop-guide.md](doc/guides/develop-guide.md).

## License

MIT — see [LICENSE](LICENSE).
