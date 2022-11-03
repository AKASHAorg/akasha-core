import * as React from 'react';
import { Box } from 'grommet';
import { StyledText } from '../styled-form-card';
import Button from '../../Button';
import Icon from '../../Icon';
import SocialLinkInput, { EnsTxtPresets } from './social-link-input';
import IconButton from '../../IconButton';
import styled from 'styled-components';

export interface SocialLinksSectionProps {
  title: string;
  links?: StateLink[];
  onLinkCreate: () => void;
  onLinkInputChange: (id: number, value: string) => void;
  onLinkTypeChange: (id: number, value: string) => void;
  onLinkRemove: (id: number) => void;
}
export type StateLink = {
  id: number;
  type: string;
  value: string;
};

const SocialLinksSection: React.FC<SocialLinksSectionProps> = props => {
  const handleLinkTypeChange = (id: number, type: string) => () => {
    props.onLinkTypeChange(id, type);
  };
  const handleLinkRemove = (id: number) => () => {
    props.onLinkRemove(id);
  };
  return (
    <Box direction="column" margin={{ top: 'small', bottom: 'medium' }}>
      <Box direction="row" align="start" justify="between">
        <StyledText
          size="small"
          margin={{ bottom: 'small', left: '0' }}
          color="secondaryText"
          style={{ userSelect: 'none' }}
        >
          {props.title}
        </StyledText>
        <Box align="end" margin={{ bottom: 'medium' }}>
          <Button label={'Add Social Link'} onClick={props.onLinkCreate} />
        </Box>
      </Box>
      <Box>
        {props.links?.map(link => (
          <Box key={link.id} direction="row" align="baseline">
            <SocialLinkInput
              margin={{ bottom: 'small' }}
              id={link.id}
              usedTypes={props.links?.map(l => l.type)}
              options={Object.values(EnsTxtPresets)
                .filter(p => p !== EnsTxtPresets.AVATAR && p !== EnsTxtPresets.DESCRIPTION)
                .map(type => ({
                  type,
                  item: (
                    <Icon
                      key={link.id}
                      style={{ marginRight: '0.75rem', maxWidth: '1.25rem' }}
                      type={getIconType(type)}
                      onClick={handleLinkTypeChange(link.id, type)}
                    />
                  ),
                }))}
              value={link.value}
              selectedOption={link.type}
              onChange={props.onLinkInputChange}
            />
            <RemoveButton
              plain={true}
              type="button"
              icon={<Icon type="trash" />}
              onClick={handleLinkRemove(link.id)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const RemoveButton = styled(IconButton)`
  height: 2.2rem;
  border-radius: 4px;
`;

const getIconType = (type: string) => {
  switch (type) {
    case EnsTxtPresets.DISCORD:
      return 'discord';
    case EnsTxtPresets.GITHUB:
      return 'github';
    case EnsTxtPresets.REDDIT:
      return 'reddit';
    case EnsTxtPresets.TELEGRAM:
      return 'telegram';
    case EnsTxtPresets.TWITTER:
      return 'twitter';
    case EnsTxtPresets.URL:
      return 'link';
    default:
      return 'link';
  }
};

export default SocialLinksSection;
