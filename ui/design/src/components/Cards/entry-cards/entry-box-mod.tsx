import * as React from 'react';
import { Box, Text } from 'grommet';
import { createEditor } from 'slate';
import { Slate, withReact, Editable } from 'slate-react';

import ViewportSizeProvider from '../../Providers/viewport-dimension';
import { formatRelativeTime, ILocale } from '../../../utils/time';

import { ProfileAvatarButton } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import CardActionsMod from './card-actions-mod';
import CardHeaderAkashaDropdown from './card-header-akasha';
import { StyledProfileDrop } from './styled-entry-box';
import { ProfileMiniCard } from '../profile-cards/profile-mini-card';
import { IEntryData, IContentClickDetails } from './entry-box';

import { withMentions, withImages, withTags } from '../../Editor/plugins';
import { renderElement, renderLeaf } from '../../Editor/renderers';

export interface IEntryBoxModProps {
  entryData: IEntryData;
  repostsLabel: string;
  repliesLabel: string;
  locale: ILocale;
  comment?: boolean;
  contentClickable?: boolean;
  onClickAvatar: React.MouseEventHandler<HTMLDivElement>;
  onContentClick?: (details: IContentClickDetails) => void;
}

const EntryBoxMod: React.FC<IEntryBoxModProps> = props => {
  const {
    entryData,
    repostsLabel,
    repliesLabel,
    locale,
    contentClickable,
    onClickAvatar,
    onContentClick,
  } = props;

  const [menuDropOpen, setMenuDropOpen] = React.useState(false);
  const [profileDropOpen, setProfileDropOpen] = React.useState(false);
  const [displayCID, setDisplayCID] = React.useState(false);

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const profileRef: React.Ref<HTMLDivElement> = React.useRef(null);
  const akashaRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const editor = React.useMemo(
    () => withTags(withMentions(withReact(withImages(createEditor())))),
    [],
  );

  const toggleMenuDrop = () => {
    setMenuDropOpen(!menuDropOpen);
  };

  const handleRepliesClick = () => handleContentClick(entryData);

  const handleContentClick = (data?: IEntryData) => {
    if (onContentClick && typeof onContentClick === 'function' && data) {
      onContentClick({
        authorEthAddress: entryData.author.ethAddress,
        entryId: entryData.entryId,
        replyTo: null,
      });
    }
  };

  const toggleDisplayCID = () => {
    setDisplayCID(!displayCID);
  };

  return (
    <ViewportSizeProvider>
      <>
        <Box direction="row" justify="between" pad={{ vertical: 'medium' }}>
          <ProfileAvatarButton
            label={entryData.author?.userName}
            info={entryData.author?.ensName}
            avatarImage={entryData.author?.avatar}
            onClickAvatar={onClickAvatar}
            onClick={() => setProfileDropOpen(!profileDropOpen)}
            ethAddress={entryData.author?.ethAddress}
            ref={profileRef}
          />
          {profileRef.current && profileDropOpen && (
            <StyledProfileDrop
              overflow="hidden"
              target={profileRef.current}
              align={{ top: 'bottom', left: 'left' }}
              onClickOutside={() => setProfileDropOpen(false)}
              onEsc={() => setProfileDropOpen(false)}
            >
              <Box width="20rem" round="small" flex="grow">
                <ProfileMiniCard
                  profileData={entryData.author}
                  handleFollow={() => null}
                  handleUnfollow={() => null}
                />
              </Box>
            </StyledProfileDrop>
          )}
          <Box direction="row" gap="xsmall" align="center">
            {entryData.time && <Text>{formatRelativeTime(entryData.time, locale)}</Text>}
            <Icon
              type="akasha"
              size="sm"
              onClick={toggleDisplayCID}
              ref={akashaRef}
              clickable={true}
            />
            <Icon type="moreDark" onClick={toggleMenuDrop} clickable={true} ref={menuIconRef} />
          </Box>
        </Box>
        {entryData.CID && akashaRef.current && displayCID && (
          <CardHeaderAkashaDropdown
            target={akashaRef.current}
            onMenuClose={() => {
              setDisplayCID(false);
            }}
            CID={entryData.CID}
          />
        )}
        <Box
          pad={{ vertical: 'medium' }}
          style={{ cursor: contentClickable ? 'pointer' : 'default' }}
          onClick={() => (contentClickable ? handleContentClick(entryData) : false)}
        >
          {/* switch to readonly Editor */}
          <Slate
            editor={editor}
            value={entryData.content}
            onChange={() => {
              return;
            }}
          >
            <Editable readOnly={true} renderElement={renderElement} renderLeaf={renderLeaf} />
          </Slate>
        </Box>
        <CardActionsMod
          entryData={entryData}
          repostsLabel={repostsLabel}
          repliesLabel={repliesLabel}
          handleRepliesClick={handleRepliesClick}
        />
      </>
    </ViewportSizeProvider>
  );
};

export { EntryBoxMod };
