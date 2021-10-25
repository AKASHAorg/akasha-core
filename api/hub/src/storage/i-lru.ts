export interface ILRU {
  set(key: string, value: any): Promise<void>;

  get(key: string): Promise<any>;

  has(key: string): Promise<boolean>;

  del(key: string): Promise<void>;

  delete(key: string): Promise<void>;

  /**
   * Add a value to a set
   * @param key
   * @param value
   */
  sAdd(key: string, value: string): Promise<void>;

  /**
   * Returns the members of a set
   * @param key
   */
  sMembers(key: string): Promise<string[]>;

  /**
   * Removes and returns the last value from a set
   * @param key
   */
  sPop(key: string): Promise<string | void>;
}
