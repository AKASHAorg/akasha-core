import { IProfileData } from './profile';

export interface IEntryData {
  CID?: string;
  content: any;
  time?: string | number | Date;
  replies?: number;
  reposts?: number;
  ipfsLink: string;
  permalink: string;
  entryId: string;
  author: IProfileData;
  quotedByAuthors?: IProfileData[];
  quotedBy?: string[];
  quote?: IEntryData;
  delisted?: boolean;
  reported?: boolean;
  type?: string;
}
