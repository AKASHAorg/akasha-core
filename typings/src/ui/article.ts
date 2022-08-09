export interface IArticleData {
  authorAvatar: { url?: string; fallbackUr?: string };
  authorName: string;
  authorEthAddress: string;
  authorPubkey: string;
  publishDate: string;
  readTime: number;
  isCopyrighted: boolean;
  title: string;
  subtitle: string;
  placeholderImage?: string;
  topics: string[];
  mentions: number;
  replies: number;
}
