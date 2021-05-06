import * as React from 'react';
import { Portal } from './helpers';
import { StyledPopoverDiv, StyledPopoverValueBox } from './styled-editor-box';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';

export interface IMentionPopover {
  values: Partial<IProfileData>[];
  ref: React.Ref<HTMLDivElement>;
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
}

export const MentionPopover: React.FC<IMentionPopover> = React.forwardRef((props, ref) => {
  const { values, currentIndex, setIndex, handleSelect } = props;

  return (
    <Portal>
      <StyledPopoverDiv ref={ref}>
        {values.map((value, i) => (
          <StyledPopoverValueBox
            pad="small"
            key={i}
            background={i === currentIndex}
            onClick={() => {
              handleSelect(i);
            }}
            onMouseEnter={() => {
              setIndex(i);
            }}
          >
            <ProfileAvatarButton
              label={value.name}
              info={value.userName && `@${value.userName}`}
              avatarImage={value.avatar}
              ethAddress={value.ethAddress as string}
            />
          </StyledPopoverValueBox>
        ))}
      </StyledPopoverDiv>
    </Portal>
  );
});

MentionPopover.displayName = 'Mention Popover';
