<!--
@license
Copyright (c) rljson

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# @rljson/cars-bff-runtime

English | [Deutsch](README.de.md)

[![CI](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml/badge.svg)](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml)

Backend for frontend of the cars example app: serves the API of the browser.

## Motivation

- The browser talks to one backend only, which gathers what the domains answer
- It runs as the container `cars-server` and links the domain runtimes as packages
- For now it answers the hello world: its own line, then the line of
  `@rljson/cars-master-runtime`

## Installation

The package is private and not published to npm. Depend on a tagged
version of its git repository:

```bash
pnpm add git+ssh://git@github.com/rljson/cars-bff-runtime.git#semver:^0.0.1
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

Without sources, `start()` answers the line of `@rljson/cars-master-runtime`
after its own. The package comes from git, so its `prepare` script builds it
on install.

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
