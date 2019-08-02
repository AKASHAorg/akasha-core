export default interface IStash {
  readonly cache;

  get(key: string): object;

  set(key: string, value: object): void;
}
