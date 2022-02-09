import React from 'react';
import DS from '@akashaproject/design-system';
import { StyledIcon, StyledText } from '../styles';
import { IAppearanceOption } from '../interfaces';

const { Box, RadioButtonGroup } = DS;

const AppearanceOption: React.FC<IAppearanceOption> = props => {
  const { titleLabel, appThemeLabel, appThemeInfo, theme, onThemeSelect, OnChevronLeftClick } =
    props;

  return (
    <>
      <Box direction="row" pad="medium" align="center" border={{ side: 'bottom', color: 'border' }}>
        <StyledIcon type="chevronLeft" onClick={OnChevronLeftClick} />
        <StyledText weight="bold" size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
          {titleLabel}
        </StyledText>
      </Box>
      <Box
        direction="row"
        pad="medium"
        justify="between"
        align="center"
        border={{ side: 'bottom', color: 'border' }}
      >
        <StyledText weight="bold">{appThemeLabel}</StyledText>
      </Box>
      <Box
        pad={{ top: 'medium', horizontal: 'medium', bottom: 'large' }}
        justify="center"
        align="start"
        border={{ side: 'bottom', color: 'border' }}
      >
        <StyledText>{appThemeInfo}:</StyledText>
        <RadioButtonGroup
          gap="xsmall"
          pad={{ top: 'medium' }}
          name="reasons"
          options={['Dark Theme', 'Light Theme']}
          value={theme}
          onChange={onThemeSelect}
        />
      </Box>
    </>
  );
};

export default AppearanceOption;
