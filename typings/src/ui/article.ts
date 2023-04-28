import { IProfileData } from './profile';

type ArticleContent = { type: string; value: string };

export interface IArticleData {
  id: string;
  authorAvatar: { url?: string; fallbackUr?: string };
  authorName: string;
  authorEthAddress: string;
  authorPubkey: string;
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
    ethAddress: string;
    avatar?: IProfileData['avatar'];
  }[];
}
