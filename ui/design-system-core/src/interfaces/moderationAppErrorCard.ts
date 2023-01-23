export interface IModerationAppErrorCardProps {
  boxSize: string;
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
  onClick?: () => void;
}
