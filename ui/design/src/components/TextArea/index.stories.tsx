/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, number, select, text, object, color } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import TextArea from './index';

// type ResizeValue = 'vertical' | 'horizontal' | boolean

const TextAreaComponent = () => {
  const [value, setValue] = React.useState('');
  return (
    <TextArea
      id={text('id', 'text-area-example')}
      fill={boolean('fill', false)}
      focusIndicator={boolean('fousIndicator', false)}
      name={text('name', 'name')}
      onChange={event => setValue(event.target.value)}
      placeholder={text('placeholder', 'Type something about you')}
      plain={boolean('plain', false)}
      value={value}
      // resize={select<ResizeValue>(
      //   'resize',
      //   {
      //     vertical: 'vertical',
      //     horizontal: 'horizontal',
      //     'no resize': false,
      //     both: true,
      //   },
      //   false,
      // )}
      size={select<string>(
        'size',
        {
          small: 'small',
          medium: 'medium',
          large: 'large',
          xlarge: 'xlarge',
        },
        'small',
      )}
      onClick={() => action('onBlur')('Synthetic Event')}
      onBlur={() => action('onClick')('Synthetic Event')}
      label={text('label', 'About me')}
      showCounter={boolean('showCounter', true)}
      maxLength={number('maxLength', 200, { min: 1, max: 200, step: 1, range: false })}
      margin={object('Margin', { margin: '0px' })}
      backgroundColor={color('Background Color', '')}
    />
  );
};

storiesOf('TextArea', module).add('TextArea', () => <TextAreaComponent />);
