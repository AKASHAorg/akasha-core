import { DataProviderInput } from './common';
import { Observable } from 'rxjs';

export interface AWF_IEntry {
  getEntry(entryId: string): Observable<unknown>;
  getEntries(opt: { offset?: string; limit: number }): Observable<unknown>;
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
  entriesByTag(opt: { name: string; offset?: string; limit: number }): Observable<unknown>;
  getLinkPreview(link: string): unknown;
  getFeedEntries(opt: { offset?: number; limit: number }): unknown;
}
export interface AWF_IComments {
  getComment(commentID: string): unknown;
  getComments(opt: { offset?: string; limit: number; postID: string }): unknown;
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
  getTag(tagName: string): unknown;
  getTags(opt: { offset?: string; limit: number }): unknown;
  searchTags(name: string): unknown;
  createTag(tagName: string): unknown;
  getTrending(): unknown;
}
