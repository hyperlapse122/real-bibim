# syntax=docker.io/docker/dockerfile:1.7-labs
FROM node:22-alpine AS base
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder-base

FROM builder-base AS deps
WORKDIR /app

COPY ./out/json .
RUN yarn --immutable

FROM deps AS deps-prod

RUN yarn workspaces focus -A --production

FROM builder-base AS builder
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app .
COPY ./out/full .

RUN yarn turbo run --cache=local:r,remote:r build

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs ./out/json/apps/web/package.json /app/
COPY --from=deps-prod --chown=nodejs:nodejs /app/apps/web/node_modules /app/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/build /app/build

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost:${PORT}/health-check || exit 1

USER nodejs
EXPOSE 3000
CMD ["node", "./node_modules/.bin/react-router-serve", "./build/server/index.js"]