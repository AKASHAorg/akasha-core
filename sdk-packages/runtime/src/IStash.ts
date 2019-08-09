export default interface IStash {
  readonly cache;

  get(key: string): any;

  set(key: string, value: any): void;
}
