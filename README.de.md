<!--
@license
Copyright (c) rljson

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# @rljson/cars-bff-runtime

[English](README.md) | Deutsch

[![CI](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml/badge.svg)](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml)
[![npm](https://img.shields.io/npm/v/@rljson/cars-bff-runtime.svg)](https://www.npmjs.com/package/@rljson/cars-bff-runtime)

Backend for Frontend der cars-Beispiel-App: bedient die API des Browsers.

## Motivation

- Der Browser spricht nur mit einem Backend, das sammelt, was die Domänen antworten
- Es läuft als Container `cars-server` und bindet die Runtimes der Domänen als Pakete ein
- Vorerst beantwortet es das Hello World: seine eigene Zeile und die weiterer Quellen

## Installation

```bash
pnpm add @rljson/cars-bff-runtime
```

## Verwendung

```ts
import { start } from '@rljson/cars-bff-runtime';

await start({ PORT: '3000' }, [() => 'Hello from a source']);
```

Gibt aus:

```text
cars-bff-runtime listens on port 3000
```

## Container

Den Container `cars-server` in der Registry bauen:

```bash
az acr build --registry crcarsdemo --image cars-server:<version>-<sha> .
```

## Grenzen

- Beantwortet nur `/api/hello` und `/health`
- Noch keine Anmeldung

## Dokumentation

- Die Leitfäden in [doc/guides](doc/guides)

## Stand

Vor 1.0 — die API kann sich zwischen Minor-Versionen ändern.

## Mitwirken

Siehe [doc/guides/develop-guide.md](doc/guides/develop-guide.md).

## Lizenz

MIT — siehe [LICENSE](LICENSE).
