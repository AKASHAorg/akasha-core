import * as React from 'react';
import { Box, Meter, Stack, Text } from 'grommet';

/**
 * @param maxValue - maximum number of characters allowed
 * @param counter - current text length
 */
export interface IEditorMeter {
  maxValue: number;
  counter: number;
}

const EditorMeter: React.FC<IEditorMeter> = props => {
  const { counter, maxValue } = props;
  const remainingChars = maxValue - counter;
  let displayCounter: null | number = null;
  let displayColor = 'accentText';
  if (remainingChars >= 0) {
    displayColor = 'accentText';
    if (remainingChars < 21) {
      displayCounter = remainingChars;
    }
  }
  if (remainingChars < 0) {
    displayCounter = Math.max(remainingChars, -99);
    displayColor = 'errorText';
  }

  return (
    <Stack anchor="center">
      <Box align="center" justify="center">
        <Meter
          max={maxValue}
          size="24px"
          thickness="medium"
          background="lightBackground"
          type="circle"
          values={[{ value: counter, color: displayColor }]}
        />
      </Box>
      <Box align="center" justify="center">
        <Text size="small" color={displayColor}>
          {displayCounter}
        </Text>
      </Box>
    </Stack>
  );
};

export default EditorMeter;
