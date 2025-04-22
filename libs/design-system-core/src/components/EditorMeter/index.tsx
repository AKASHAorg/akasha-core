import React from 'react';
import Meter from '../Meter';
import Text from '../Text';

export type EditorMeterProps = {
  max: number;
  value: number;
  background?: string;
  customStyle?: string;
};

/**
 * An EditorMeter component displays a visual indicator that provides instant feedback as
 * the user types. The EditorMeter generally shows the user the character count and how much
 * percentage they have left before they reach the maximum word count allowed.
 * @param max - a number representing the maximum
 * @param value - a number representing the current count
 * @param background - (optional) customize the background color
 * @param customStyle - (optional) customize the general style
 * @example
 * ```tsx
 *  <EditorMeter value={50} max={100} />
 * ```
 **/
const EditorMeter: React.FC<EditorMeterProps> = props => {
  const { value, max, background = 'stroke-grey8 dark:stroke-grey4', customStyle } = props;
  const remainingChars = max - value;
  let displayCounter: null | number = null;
  let progressStyle = 'stroke-secondaryLight dark:stroke-secondaryDark';

  if (remainingChars < 0) {
    displayCounter = Math.max(remainingChars, -99);
    progressStyle = 'stroke-errorLight dark:stroke-errorDark';
  }

  if (remainingChars === 1 || remainingChars === 0) {
    displayCounter = remainingChars;
    progressStyle = 'stroke-warningLight dark:stroke-warningDark';
  }

  return (
    <Meter
      max={max}
      size={32}
      thickness={2}
      value={value}
      background={background}
      progressBg={progressStyle}
      customStyle={customStyle}
    >
      {displayCounter !== null && (
        <Text variant="footnotes2" weight="normal" customStyle={progressStyle}>
          {displayCounter}
        </Text>
      )}
    </Meter>
  );
};

export default EditorMeter;
