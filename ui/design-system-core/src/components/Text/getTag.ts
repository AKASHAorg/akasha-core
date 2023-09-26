import { Heading, Variant, BodyText, ButtonText } from './index';

function isHeading(variant: Variant): variant is Heading {
  return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant);
}

function isBodyText(variant: Variant): variant is BodyText {
  return ['subtitle1', 'subtitle2', 'body1', 'body2', 'label', 'footnotes1', 'footnotes2'].includes(
    variant,
  );
}

function isButtonText(variant: Variant): variant is ButtonText {
  return ['button-lg', 'button-md', 'button-sm'].includes(variant);
}

export function getTag(variant: Variant) {
  if (isHeading(variant)) return variant;

  if (isBodyText(variant) || isButtonText(variant)) return 'p';
}
