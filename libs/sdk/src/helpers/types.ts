// from hook utils :D
type ExtractByKey<T, K extends keyof any> = T extends infer R
  ? K extends keyof R
    ? R
    : never
  : never;

type KeyofUnion<T> = T extends infer R ? keyof R : never;

export function hasOwn<T extends Record<keyof any, any>, K extends keyof any>(
  o: T,
  v: K,
): o is K extends KeyofUnion<T> ? ExtractByKey<T, K> : T & { [P in K]: unknown } {
  return Object.hasOwn(o, v);
}
