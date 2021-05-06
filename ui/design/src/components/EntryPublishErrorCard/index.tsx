import * as React from 'react';
import { Box } from 'grommet';
import styled from 'styled-components';
import EntryLoadingPlaceholder from '../VirtualList/placeholders/entry-card-placeholder';
import Icon from '../Icon';

export interface PublishErrorCardProps {
  style?: React.CSSProperties;
  isCard?: boolean;
  message: string;
}

const MessageWrapper = styled(Box)`
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  bottom: 0.5em;
  right: 0.5em;
  padding: 0.5em;
  border-radius: ${props => props.theme.shapes.borderRadius};
  border-color: ${props => props.theme.colors.accent};
  border-style: dashed;
  justify-content: center;
  align-items: center;
  border-width: 1px;
`;

const ErrorIcon = styled(Icon)`
  color: ${props => props.theme.colors.accent};
  margin-bottom: 1em;
`;

const EntryPublishErrorCard: React.FC<PublishErrorCardProps> = props => {
  return (
    <EntryLoadingPlaceholder
      style={{
        flex: '1 auto',
        position: 'relative',
        ...props.style,
      }}
    >
      <MessageWrapper>
        <ErrorIcon type="quote" color="#4e71ff" />
        {props.message}
        <div>{props.children}</div>
      </MessageWrapper>
    </EntryLoadingPlaceholder>
  );
};

export default EntryPublishErrorCard;
