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
  title: string;
  /**
   * Additional details about the error
   */
  details: string;
}
