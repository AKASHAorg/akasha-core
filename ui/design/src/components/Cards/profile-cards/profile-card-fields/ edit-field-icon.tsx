import * as React from 'react';
import { Icon } from '../../../Icon/index';
import { StyledCenterDiv, StyledImage } from '../styled-profile-card';

export interface IEditFieldIcon {
  ref: React.Ref<HTMLDivElement>;
  providerIcon?: string;
  popoverHandler: () => void;
}

const EditFieldIcon: React.FC<IEditFieldIcon> = React.forwardRef((props, ref) => {
  const { providerIcon, popoverHandler } = props;

  return (
    <StyledCenterDiv ref={ref}>
      {providerIcon ? (
        <StyledImage src={providerIcon} onClick={popoverHandler} fit="contain" />
      ) : (
        <Icon clickable={true} type="editSimple" default={true} onClick={popoverHandler} />
      )}
    </StyledCenterDiv>
  );
});

export { EditFieldIcon };
