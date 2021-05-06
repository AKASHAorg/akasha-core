import React from 'react';
import { Box, Grommet } from 'grommet';

import SelectPopover, { ISelectPopover } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Popovers/SelectPopover',
  component: SelectPopover,
  argTypes: {
    onClickElem: { action: 'clicked element' },
  },
};

const providerData = [
  { providerName: '3box', value: 'Some short text about 3Box' },
  {
    providerName: 'ENS',
    value:
      'A very long and uninspiring text, duplicated.A very long and uninspiring text, duplicated.A very long and uninspiring text, duplicated.',
  },
];

const Template = (args: ISelectPopover) => {
  const iconRef: React.Ref<any> = React.useRef();
  const [selectOpen, setSelectOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <div ref={iconRef}>
            <Icon type="eye" onClick={() => setSelectOpen(true)} />
          </div>
          {iconRef.current && selectOpen && (
            <SelectPopover
              {...args}
              target={iconRef.current}
              closePopover={() => setSelectOpen(false)}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseSelectPopover = Template.bind({});

BaseSelectPopover.args = {
  dataSource: providerData,
};
