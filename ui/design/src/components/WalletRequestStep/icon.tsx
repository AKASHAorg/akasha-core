import React from 'react';
import { StyledArrowIcon, StyledIcon } from './styles';
import Icon from '../Icon';

interface WalletRequestIconProps {
  error?: string;
  pending: boolean;
}

export const WalletRequestIcon = ({ error, pending }: WalletRequestIconProps) => {
  if (error) {
    return (
      <StyledIcon>
        <Icon type="error" size="md" color="red" />
      </StyledIcon>
    );
  }

  if (pending)
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
