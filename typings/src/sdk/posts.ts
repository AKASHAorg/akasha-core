import { z } from 'zod';
// title?: string; tags?: string[]; quotes?: string[]; mentions?: string[]
export const PostToPublishSchema = z
  .object({
    title: z.string(),
    tags: z.array(z.string()),
    quotes: z.array(z.string()),
    mentions: z.array(z.string()),
}).partial();

export type PostToPublish = z.infer<typeof PostToPublishSchema>;
