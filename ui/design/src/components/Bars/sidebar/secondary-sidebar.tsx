import { Box, Text } from 'grommet';
import * as React from 'react';
import { IconLink } from '../../Buttons';
import { AppIcon } from '../../Icon/index';
import { IApp } from './sidebar';
import { SecondarySidebarBox, SecondarySidebarContentWrapper } from './styled-sidebar';

export interface ISecondarySidebarProps {
  appData: IApp;
  onClickOption: (option: string) => void;
}

const SecondarySidebar: React.FC<ISecondarySidebarProps> = props => {
  const { appData, onClickOption } = props;

  const [activeOption, setActiveOption] = React.useState('');

  React.useEffect(() => {
    const firstOption = appData.options[0];
    setActiveOption(firstOption);
  }, [appData.options]);

  const handleOptionClick = (option: string) => () => {
    setActiveOption(option);
    onClickOption(option);
  };

  return (
    <SecondarySidebarBox
      fill="vertical"
      direction="column"
      align="center"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'right',
      }}
    >
      <SecondarySidebarContentWrapper>
        <Box
          pad={{ vertical: 'small', horizontal: 'none' }}
          fill="horizontal"
          border={{ color: 'border', size: '1px', side: 'bottom' }}
          gap="xsmall"
          direction="row"
          align="center"
        >
          <AppIcon placeholderIconType="app" size="md" appImg={appData.image} />
          <Text size="large">{appData.name}</Text>
        </Box>
        <Box pad="none">
          {appData.options?.map((option, index) => (
            <Box pad={{ vertical: 'xsmall' }} key={index}>
              <IconLink
                label={option}
                onClick={handleOptionClick(option)}
                active={option === activeOption}
              />
            </Box>
          ))}
        </Box>
      </SecondarySidebarContentWrapper>
    </SecondarySidebarBox>
  );
};

export { SecondarySidebar };
