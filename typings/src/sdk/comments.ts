import { z } from "zod";

export const CommentIDSchema = z.string().min(4);
export type CommentID = z.infer<typeof CommentIDSchema>;
