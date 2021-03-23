export interface ErrorLoaderProps {
  /**
   * Error type
   */
  type:
    | 'missing-feed-customization'
    | 'missing-saved-items'
    | 'missing-notifications'
    | 'no-connection'
    | 'no-login'
    | 'script-error';
  /* Path to public folder */
  publicImgPath?: string;
  /**
   * The error title
   */
  title: React.ReactNode;
  /**
   * Additional details about the error
   */
  details: string | React.ReactNode;
  /**
   *  Message to be shown when in deveolopment mode
   */
  devDetails?: string | React.ReactNode;
  style?: React.CSSProperties;
}

export interface IModerationAppErrorCardProps {
  size: string;
  errorType: string;
  titleLabel: string;
  subtitleLabel: string;
  buttonLabel?: string;
  textMarginTop?: boolean;
  textMarginBottom?: boolean;
  hasButton?: boolean;
  imageBoxHasMargin?: boolean;
  /* Path to public folder */
  publicImgPath?: string;
  showLoginModal?: () => void;
}
