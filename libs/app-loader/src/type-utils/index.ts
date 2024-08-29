import { IAppConfig, IntegrationRegistrationOptions, IPlugin } from '@akashaorg/typings/lib/ui';

export type FilterEmpty<T> =
  T extends Record<string, never> ? (keyof T extends never ? never : T) : T;
/**
 * `DeepTarget` is a utility type to infer the type of deeply nested property within
 * an object type `T`, given an array of keys representing the path to the target property.
 *
 * Example usage:
 *
 * // Extract a nested type:
 * type AkashaAppEdgeNode = DeepTarget\<GetAppsByPublisherDidQuery, ['node', 'akashaAppList', 'edges', 0, 'node']\>;
 *
 * WARNING! Do not cast objects to this type unless you are 100% sure that it's correct!
 */
export type DeepTarget<T, Path extends unknown[]> = Path extends [infer First, ...infer Rest]
  ? First extends keyof NonNullable<T>
    ? Rest extends []
      ? FilterEmpty<NonNullable<T>[First]>
      : DeepTarget<FilterEmpty<NonNullable<T>[First]>, Rest>
    : never
  : never;

export type SystemModuleType = {
  register?: (opts: IntegrationRegistrationOptions) => IAppConfig;
  initialize?: (opts: Partial<IntegrationRegistrationOptions>) => Promise<void> | void;
  registerPlugin?: (
    opts: Omit<IntegrationRegistrationOptions, 'layoutSlots'> & {
      encodeAppName: (name: string) => string;
      decodeAppName: (name: string) => string;
    },
  ) => Promise<IPlugin>;
  uninstall?: (opts: IntegrationRegistrationOptions) => Promise<void> | void;
  registerResources?: (opts: Partial<IntegrationRegistrationOptions>) => Promise<void> | void;
};
