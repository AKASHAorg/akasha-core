import * as React from 'react';
import Meter from '../Meter';
import Text from '../Text';

export type EditorMeterProps = {
  max: number;
  value: number;
};

const EditorMeter: React.FC<EditorMeterProps> = props => {
  const { value, max } = props;
  const remainingChars = max - value;
  let displayCounter: null | number = null;
  let progressStyle = { light: 'text-secondary-light', dark: 'text-secondary-dark' };

  if (remainingChars < 0) {
    displayCounter = Math.max(remainingChars, -99);
    progressStyle = { light: 'text-error-light', dark: 'text-error-dark' };
  }

  if (remainingChars === 1 || remainingChars === 0) {
    displayCounter = remainingChars;
    progressStyle = { light: 'text-warning-light', dark: 'text-warning-dark' };
  }

  return (
    <Meter
      max={max}
      size={24}
      thickness={2}
      value={value}
      background={{ light: 'text-grey8', dark: 'text-grey4' }}
      progressBg={progressStyle}
    >
      <Text variant="footnotes2" color={progressStyle} weight="normal">
        {displayCounter}
      </Text>
    </Meter>
  );
};

export default EditorMeter;
