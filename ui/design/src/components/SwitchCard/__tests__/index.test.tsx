/* eslint-disable react/prop-types */
import * as React from 'react';
// import { create } from 'react-test-renderer';
import { render } from '@testing-library/react';

import SwitchCard from '../';
import { ISwitchCardComponent } from '../SwitchCard.stories';
import { wrapWithTheme } from '../../../test-utils';

const SwitchCardComponent: React.FC<ISwitchCardComponent> = props => {
  const { count, countLabel, buttonLabels, buttonValues, onIconClick } = props;
  const [activeButton, setActiveButton] = React.useState<string>('All');

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  return (
    <SwitchCard
      count={count}
      hasIcon={true}
      countLabel={countLabel}
      activeButton={activeButton}
      buttonLabels={buttonLabels}
      buttonValues={buttonValues}
      hasMobileDesign={true}
      onIconClick={onIconClick}
      onTabClick={onTabClick}
      loggedEthAddress={'0x000'}
    />
  );
};

describe('SwitchCard component', () => {
  it('renders correctly', () => {
    render(
      wrapWithTheme(
        <SwitchCardComponent
          count={1276}
          countLabel={'results'}
          buttonLabels={['All', 'Posts', 'Topics', 'People']}
          buttonValues={['All', 'Posts', 'Topics', 'People']}
          onIconClick={() => null}
        />,
      ),
    );
  });
});
