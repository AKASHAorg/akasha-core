import { DataProviderInput } from './common';
import { Observable } from 'rxjs';

export interface AWF_IEntry {
  /**
   *
   * @param entryId
   */
  getEntry(entryId: string): Observable<unknown>;

  /**
   *
   * @param opt
   */
  getEntries(opt: { offset?: string; limit: number }): Observable<unknown>;

  /**
   *
   * @param opt
   */
  postEntry(opt: {
    data: DataProviderInput[];
    post: { title?: string; tags?: string[]; quotes?: string[] };
  }): unknown;

  editEntry(opt: {
    entryID: string;
    data: DataProviderInput[];
    post: { title?: string; tags?: string[]; quotes?: string[] };
  }): unknown;

  removeEntry(entryID: string): unknown;

  entriesByAuthor(opt: { pubKey: string; offset?: number; limit: number }): Observable<unknown>;

  /**
   *
   * @param opt
   */
  entriesByTag(opt: { name: string; offset?: string; limit: number }): Observable<unknown>;
}

export interface AWF_IComments {
  /**
   *
   * @param commentID
   */
  getComment(commentID: string): unknown;

  /**
   *
   * @param opt
   */
  getComments(opt: { offset?: string; limit: number; postID: string }): unknown;

  /**
   *
   * @param opt
   */
  addComment(opt: {
    data: DataProviderInput[];
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }): unknown;

  editComment(opt: {
    commentID: string;
    data: DataProviderInput[];
    comment: { postID: string; replyTo?: string; tags?: string[]; mentions?: string[] };
  }): unknown;

  removeComment(commentID: string): unknown;
}

export interface AWF_ITags {
  /**
   *
   * @param tagName
   */
  getTag(tagName: string): unknown;

  /**
   *
   * @param opt
   */
  getTags(opt: { offset?: string; limit: number }): unknown;

  /**
   *
   * @param name
   */
  searchTags(name: string): unknown;

  /**
   *
   * @param tagName
   */
  createTag(tagName: string): unknown;

  /**
   * Returns most recent used tags
   */
  getTrending(): unknown;
}
