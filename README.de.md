<!--
@license
Copyright (c) rljson

Use of this source code is governed by terms that can be
found in the LICENSE file in the root of this package.
-->

# @rljson/cars-bff-runtime

[English](README.md) | Deutsch

[![CI](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml/badge.svg)](https://github.com/rljson/cars-bff-runtime/actions/workflows/quick_check.yaml)

Backend for Frontend der cars-Beispiel-App: bedient die API des Browsers.

## Motivation

- Der Browser spricht nur mit einem Backend, das sammelt, was die Domänen antworten
- Es läuft als Container `cars-bff` und fragt die Server der Domänen über HTTP
- Vorerst beantwortet es das Hello World: seine eigene Zeile, dann die von
  cars-master-runtime unter `MASTER_URL` (Standard `http://cars-master:3000`)

## Installation

Das Paket ist privat und wird nicht auf npm veröffentlicht. Abhängig
macht man sich von einer getaggten Version seines Git-Repos:

```bash
pnpm add git+ssh://git@github.com/rljson/cars-bff-runtime.git#semver:^0.0.1
```

## Verwendung

```ts
import { start } from '@rljson/cars-bff-runtime';

await start({ PORT: '3000' }, [async () => ['Hello from a source']]);
```

Gibt aus:

```text
cars-bff-runtime listens on port 3000
```

## Container

Den Container `cars-bff` in der Registry bauen:

```bash
az acr build --registry crcarsdemo --image cars-bff:<version>-<sha> .
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
