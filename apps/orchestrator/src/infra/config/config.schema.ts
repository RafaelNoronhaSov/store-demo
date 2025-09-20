import { z } from 'zod';

export const envSchema = z.object({
  PACKING_HOST: z.string().nonempty(),
  PACKING_PORT: z.coerce.number().int().positive(),
});

export type Env = z.infer<typeof envSchema>;
