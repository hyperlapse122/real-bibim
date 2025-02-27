import { z } from 'zod';

const streamEndpointUrlSchema = z.object({
  httpUrl: z.string(),
  wsUrl: z.string(),
});
export type StreamEndpointUrl = z.infer<typeof streamEndpointUrlSchema>;

export default streamEndpointUrlSchema;
