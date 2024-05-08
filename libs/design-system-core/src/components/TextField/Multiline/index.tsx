import React, { useState } from 'react';
import EditorMeter from '../../EditorMeter';
import Stack from '../../Stack';
import { getContainerClasses } from '../Input/getContainerClasses';
import { getInputClasses } from '../Input/getInputClasses';
import { MultlineProps } from '../types';
import { tw } from '@twind/core';
import { forwardRef } from 'react';
import { getRadiusClasses } from '../../../utils/getRadiusClasses';

const MAX_LENGTH = 280;

export const Multiline: React.FC<MultlineProps> = forwardRef(
  ({ id, status, disabled, radius, ...rest }, ref) => {
    const [letterCount, setLetterCount] = useState(rest.value?.toString().length);
    const containerStyle = getContainerClasses(disabled, status);
    const textAreaStyle = getInputClasses(disabled, status);
    const radiusStyle = getRadiusClasses(radius);

    return (
      <Stack
        direction="row"
        customStyle={`${containerStyle} ${radiusStyle} py-2.5`}
        spacing="gap-x-2"
      >
        <textarea
          {...rest}
          aria-labelledby={id}
          className={tw(`resize-none w-full ${textAreaStyle}`)}
          maxLength={MAX_LENGTH}
          ref={ref}
          onChange={event => {
            setLetterCount(event.target.value.length);
            rest.onChange(event);
          }}
        ></textarea>
        <EditorMeter
          max={MAX_LENGTH}
          value={letterCount}
          background="grey6"
          customStyle="ml-auto mt-auto shrink-0"
        />
      </Stack>
    );
  },
);
