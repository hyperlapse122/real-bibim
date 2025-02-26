# syntax=docker.io/docker/dockerfile:1.7-labs
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app

COPY ./out/json .
RUN yarn --immutable

FROM deps AS deps-prod

RUN yarn workspaces focus -A --production

FROM base AS builder
WORKDIR /app
ENV TURBO_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app .
COPY ./out/full .

RUN yarn turbo run --cache=local:r,remote:r build

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs ./out/json/package.json /app/
COPY --chown=nodejs:nodejs ./out/json/yarn.lock /app/
COPY --from=deps-prod --chown=nodejs:nodejs /app/apps/web/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/build ./build

USER nodejs

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["yarn", "start"]