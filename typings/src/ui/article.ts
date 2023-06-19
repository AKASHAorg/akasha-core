import { CeramicAccount } from '../sdk/graphql-types-new';
import { Profile } from './profile';

type ArticleContent = { type: string; value: string };

export interface IArticleData {
  id: string;
  authorAvatar?: Profile['avatar'];
  authorName?: string;
  authorProfileId: string;
  publishDate?: string;
  lastUpdateDate?: string;
  readTime?: number;
  isCopyrighted: boolean;
  title: string;
  subtitle: string;
  content: ArticleContent[];
  image?: string;
  topics?: string[];
  mentions?: number;
  replies?: number;
  isPublished?: boolean;
  isDraft?: boolean;
  isShared?: boolean;
  collaborators?: {
    did: Partial<CeramicAccount>;
    avatar?: Profile['avatar'];
  }[];
}
