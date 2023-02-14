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
  let progressStyles = { light: 'text-secondary-light', dark: 'text-secondary-dark' };

  if (remainingChars < 0) {
    displayCounter = Math.max(remainingChars, -99);
    progressStyles = { light: 'text-error-light', dark: 'text-error-dark' };
  }

  if (remainingChars === 1 || remainingChars === 0) {
    displayCounter = remainingChars;
    progressStyles = { light: 'text-warning-light', dark: 'text-warning-dark' };
  }

  return (
    <Meter
      max={max}
      size={24}
      thickness={2}
      value={value}
      background={{ light: 'text-grey8', dark: 'text-grey4' }}
      progressBg={progressStyles}
    >
      <Text variant="footnotes2" color={progressStyles} weight="normal">
        {displayCounter}
      </Text>
    </Meter>
  );
};

export default EditorMeter;
