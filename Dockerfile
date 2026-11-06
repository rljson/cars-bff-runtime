# @license
# Copyright (c) 2026 Rljson
#
# Use of this source code is governed by terms that can be
# found in the LICENSE file in the root of this package.

# The container cars-bff: the backend for frontend on Node, as uid 1000.

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec vite build && pnpm prune --prod

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 MASTER_URL=http://cars-master:3000
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# The image node:22-alpine has the user node with uid 1000
USER 1000
EXPOSE 3000
CMD ["node", "--input-type=module", "-e", "import('./dist/cars-bff-runtime.js').then((m) => m.start())"]
