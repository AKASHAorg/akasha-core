import { z } from 'zod';

export const IntegrationIdSchema = z.string();
export type IntegrationId = z.infer<typeof IntegrationIdSchema>;
export const IntegrationReleaseIdSchema = z.string();
export type IntegrationReleaseId = z.infer<typeof IntegrationReleaseIdSchema>;
export const IntegrationNameSchema = z.string();
export type IntegrationName = z.infer<typeof IntegrationNameSchema>;
export const IntegrationTypeSchema = z.number();

export const IntegrationInfoLinksSchema = z.object({
  publicRepository: z.string().optional(),
  documentation: z.string().optional(),
  detailedDescription: z.string().optional(),
});

export type AWF_APP_BUILD_MANIFEST = {
  links?: z.infer<typeof IntegrationInfoLinksSchema>;
  sources: string[];
};

/** Warning:  the following exported types are auto generated */
export type { IntegrationReleaseInfo as ReleaseInfo } from './graphql-types';
export type { IntegrationInfo } from './graphql-types';
