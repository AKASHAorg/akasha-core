import * as React from 'react';
import { Portal } from './helpers';
import { StyledPopoverDiv, StyledPopoverValueBox } from './styled-editor-box';
import ProfileAvatarButton from '../ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/ui';

export interface IMentionPopover {
  values: Profile[];
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
            selectedBackground={i === currentIndex}
            onClick={() => {
              handleSelect(i);
            }}
            onMouseEnter={() => {
              setIndex(i);
            }}
          >
            <ProfileAvatarButton
              label={value.name}
              info={value.name}
              avatarImage={value.avatar}
              profileId={value.did.id}
            />
          </StyledPopoverValueBox>
        ))}
      </StyledPopoverDiv>
    </Portal>
  );
});

MentionPopover.displayName = 'MentionPopover';
