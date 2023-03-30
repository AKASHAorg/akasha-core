import * as React from 'react';
import Meter from '../Meter';
import Text from '../Text';
import { Color } from '../types/common.types';

export type EditorMeterProps = {
  max: number;
  value: number;
  background?: Color;
  customStyle?: string;
};

const EditorMeter: React.FC<EditorMeterProps> = props => {
  const { value, max, background = { light: 'grey8', dark: 'grey4' }, customStyle } = props;
  const remainingChars = max - value;
  let displayCounter: null | number = null;
  let progressStyle = { light: 'secondary-light', dark: 'secondary-dark' };

  if (remainingChars < 0) {
    displayCounter = Math.max(remainingChars, -99);
    progressStyle = { light: 'error-light', dark: 'error-dark' };
  }

  if (remainingChars === 1 || remainingChars === 0) {
    displayCounter = remainingChars;
    progressStyle = { light: 'warning-light', dark: 'warning-dark' };
  }

  return (
    <Meter
      max={max}
      size={24}
      thickness={2}
      value={value}
      background={background}
      progressBg={progressStyle}
      customStyle={customStyle}
    >
      <Text variant="footnotes2" color={progressStyle} weight="normal">
        {displayCounter}
      </Text>
    </Meter>
  );
};

export default EditorMeter;
