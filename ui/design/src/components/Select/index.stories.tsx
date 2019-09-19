/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Select from './index';

const SelectComponent = () => {
  return (
    <Select
      closeOnChange={boolean('closeOnChange', true)}
      disabled={boolean('disabled', false)}
      disabledKey={text('disabledKey', '')}
      focusIndicator={boolean('disabled', true)}
      gridArea={text('gridArea', '')}
      icon={boolean('icon', true)}
      labelKey={text('labelKey', '')}
      margin={text('margin', '')}
      multiple={boolean('disabled', false)}
      onBlur={() => action('onClick')('Synthetic Event')}
      onClick={() => action('onBlur')('Synthetic Event')}
      onChange={() => action('onChange')('Synthetic Event')}
      onClose={() => action('onClose')('Synthetic Event')}
      // onMore={() => action('onMore')('Synthetic Event')}
      onOpen={() => action('onOpen')('Synthetic Event')}
      onSearch={() => action('onSearch')('Synthetic Event')}
      open={boolean('Open', true)}
      options={['one', 'two', 'three']}
      placeholder={text('placeholder', 'placeholder')}
      plain={boolean('icon', true)}
      replace={boolean('icon', true)}
      searchPlaceholder={text('searchPlaceholder', '')}
      valueKey={text('valueKey', '')}
      valueLabel={text('valueLabel', '')}
    />
  );
};

storiesOf('Select', module).add('Select', () => <SelectComponent />);
