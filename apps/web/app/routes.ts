import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('health-check', 'routes/health-check.ts'),
] satisfies RouteConfig;
