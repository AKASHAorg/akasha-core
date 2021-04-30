export interface ErrorLoaderProps {
  /**
   * Error type
   */
  type:
    | 'missing-feed-customization'
    | 'missing-saved-items'
    | 'missing-notifications'
    | 'no-connection'
    | 'network-not-supported'
    | 'no-login'
    | 'script-error'
    | 'not-registered';
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
