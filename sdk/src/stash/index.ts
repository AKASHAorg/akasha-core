import { injectable } from 'inversify';
import QuickLRU from 'quick-lru';
import { createObservableValue } from '../helpers/observable';
import hash from 'object-hash';

export type IQuickLRU = QuickLRU<string, any>;
@injectable()
class Stash {
  private _uiStash: QuickLRU<string, unknown>;
  /**
   *
   * @param args - Object with props maxSize: number and maxAge: number
   * @returns a new instance of QuickLRU
   */
  create(args: { maxSize: number; maxAge: number }) {
    const cache = new QuickLRU<never, never>(args);
    return createObservableValue(cache);
  }

  /**
   * General purpose stash for caching ui related data
   */
  getUiStash() {
    if (!this._uiStash) {
      this._uiStash = new QuickLRU<never, unknown>({ maxSize: 999, maxAge: 1000 * 60 * 5 });
    }
    return this._uiStash;
  }

  computeKey(objKey: Record<never, unknown>): string {
    return hash(objKey, { algorithm: 'sha1', unorderedObjects: true });
  }
}

export default Stash;
