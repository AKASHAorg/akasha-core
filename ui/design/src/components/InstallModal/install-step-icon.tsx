import React from 'react';
import { StyledArrowIcon, StyledIcon, StyledCheckmarkIcon } from './styles';
import Icon from '../Icon';

interface InstallStepIconProps {
  success?: boolean;
  loading?: boolean;
}

export const InstallStepIcon: React.FC<InstallStepIconProps> = ({ success, loading }) => {
  if (success) {
    return (
      <StyledCheckmarkIcon justify="center" align="center">
        <Icon type="checkSimple" color="green" size="xxs" />
      </StyledCheckmarkIcon>
    );
  }

  if (loading)
    return (
      <StyledIcon justify="center" align="center">
        <Icon type="loading" size="md" accentColor />
      </StyledIcon>
    );

  return (
    <StyledArrowIcon justify="center" align="center">
      <Icon type="arrowRight" />
    </StyledArrowIcon>
  );
};
