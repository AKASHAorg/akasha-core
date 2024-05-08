import { injectable } from 'inversify';
import QuickLRU from 'quick-lru';
import { createFormattedValue } from '../helpers/observable';
import hash from 'object-hash';
import { z } from 'zod';
import { validate } from '../common/validator';

export type IQuickLRU = QuickLRU<string, any>;
@injectable()
class Stash {
  private _uiStash: QuickLRU<string, unknown>;
  constructor() {
    this._uiStash = new QuickLRU<never, unknown>({ maxSize: 999, maxAge: 1000 * 60 * 5 });
  }
  /**
   *
   * @param args - Object with props maxSize: number and maxAge: number
   * @returns a new instance of QuickLRU
   */
  @validate(z.object({ maxSize: z.number(), maxAge: z.number() }))
  create(args: { maxSize: number; maxAge: number }) {
    const cache = new QuickLRU<never, never>(args);
    return createFormattedValue(cache);
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
