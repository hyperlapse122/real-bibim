import {
  index,
  layout,
  route,
  type RouteConfig,
} from '@react-router/dev/routes';

export default [
  layout('layouts/global-layout.tsx', [index('routes/home.tsx')]),
  route('health-check', 'routes/health-check.ts'),
] satisfies RouteConfig;
