export interface ErrorLoaderProps {
  /**
   * Error type
   */
  type:
    | 'missing-feed-customization'
    | 'missing-saved-items'
    | 'no-connection'
    | 'no-login'
    | 'script-error';
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
}
