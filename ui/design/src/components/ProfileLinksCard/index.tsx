import { Box } from 'grommet';
import * as React from 'react';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { Text } from 'grommet';
import Icon from '../Icon';
import { MarginType } from 'grommet/utils';
import Tooltip from '../Tooltip';
import { isMobile } from 'react-device-detect';
import { EnsTxtPresets } from '../ProfileForm/sections/social-link-input';

export interface ProfileLinksProps {
  titleLabel: string;
  links: {
    type: string;
    value: string;
  }[];
  className?: string;
  margin?: MarginType;
  copyLabel: string;
  copiedLabel: string;
}

const ProfileLinksCard: React.FC<ProfileLinksProps> = props => {
  if (!props.links || props.links.length === 0) {
    return null;
  }

  return (
    <MainAreaCardBox className={props.className} pad="medium" margin={props.margin}>
      <Box>
        <Text size="large" weight="bold" color="primaryText" style={{ lineHeight: 1.7 }}>
          {props.titleLabel}
        </Text>
      </Box>
      <Box direction="column">
        {props.links.map(link => (
          <ProfileLinkItem
            key={`${link.type}_${link.value}`}
            link={link}
            copyLabel={props.copyLabel}
            copiedLabel={props.copiedLabel}
          />
        ))}
      </Box>
    </MainAreaCardBox>
  );
};

export const getIconFromType = (type: string) => {
  switch (type) {
    case EnsTxtPresets.GITHUB:
      return 'githubAlt';
    case EnsTxtPresets.REDDIT:
      return 'redditAlt';
    case EnsTxtPresets.TWITTER:
      return 'twitterAlt';
    case EnsTxtPresets.DISCORD:
      return 'discordAlt';
    case EnsTxtPresets.TELEGRAM:
      return 'telegramAlt';
    default:
      return 'linkAlt';
  }
};

const getLinkUrl = (link: { type: string; value: string }) => {
  switch (link.type) {
    case EnsTxtPresets.GITHUB:
      return `https://github.com/${link.value}`;
    case EnsTxtPresets.REDDIT:
      return `https://reddit.com/user/${link.value}`;
    case EnsTxtPresets.TWITTER:
      return `https://twitter.com/${link.value}`;
    case EnsTxtPresets.TELEGRAM:
      return `https://t.me/${link.value}`;
    default:
      return link.value;
  }
};

export type LinkItemProps = {
  link: { type: string; value: string };
  copyLabel: string;
  copiedLabel: string;
};

const ProfileLinkItem: React.FC<LinkItemProps> = props => {
  const [isCopied, setIsCopied] = React.useState(false);
  const popoverRef = React.useRef();
  const handleCopy = (data: string) => () => {
    navigator.clipboard.writeText(data);
    setIsCopied(true);
  };

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  return (
    <Box direction="row" margin={{ top: 'small' }}>
      <Icon plain={true} type={getIconFromType(props.link.type)} />
      <Text size="medium" color="primaryText" margin={{ horizontal: 'small' }}>
        {getLinkUrl(props.link)}
      </Text>
      <Tooltip
        dropProps={{ align: isMobile ? { right: 'left' } : { left: 'right' } }}
        message={isCopied ? props.copiedLabel : props.copyLabel}
        icon={isCopied ? 'check' : undefined}
        plain={true}
        caretPosition={isMobile ? 'right' : 'left'}
      >
        <Icon
          type="copy"
          clickable={true}
          onClick={handleCopy(getLinkUrl(props.link))}
          ref={popoverRef}
        />
      </Tooltip>
    </Box>
  );
};

export { ProfileLinkItem };
export default ProfileLinksCard;
