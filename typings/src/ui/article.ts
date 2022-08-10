type ArticleContent = { type: string; value: string };

export interface IArticleData {
  id: string;
  authorAvatar: { url?: string; fallbackUr?: string };
  authorName: string;
  authorEthAddress: string;
  authorPubkey: string;
  publishDate: string;
  readTime: number;
  isCopyrighted: boolean;
  title: string;
  subtitle: string;
  content: ArticleContent[];
  placeholderImage?: string;
  topics: string[];
  mentions: number;
  replies: number;
}
