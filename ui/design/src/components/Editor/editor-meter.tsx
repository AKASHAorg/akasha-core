import * as React from 'react';
import { Meter } from 'grommet';

export interface IEditorMeter {
  maxValue?: number;
  counter: number;
}

const EditorMeter: React.FC<IEditorMeter> = props => {
  const { counter, maxValue } = props;

  return (
    <Meter
      max={maxValue}
      size="20px"
      thickness="medium"
      background="#C6D1FF"
      type="circle"
      values={[{ value: counter, color: 'accent' }]}
    />
  );
};

EditorMeter.defaultProps = {
  maxValue: 300,
};

export { EditorMeter };
