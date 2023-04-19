import { z } from 'zod';

export const createError = (message: string, path: z.ZodIssue['path'] = ['sdk']) => {
  const error = new z.ZodError([]);
  error.addIssue({
    code: 'custom',
    path,
    message,
  });
  return error;
};
export const throwError = (message: string, path?: z.ZodIssue['path']) => {
  const error = createError(message, path);
  throw new Error(error.toString());
};

export const returnError = (error: z.ZodError) => {
  return error;
};
