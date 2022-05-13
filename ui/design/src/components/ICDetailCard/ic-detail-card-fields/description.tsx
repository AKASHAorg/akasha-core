import * as React from 'react';
import { Text } from 'grommet';
import styled from 'styled-components';
import MdCard from '../../MdCard';

export interface ICDetailCardDescriptionProps {
  description?: string;
}

const StyledText = styled(Text)`
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
  line-height: 1.375rem;
  font-size: 0.9375rem;
`;

const ICDetailCardDescription: React.FC<ICDetailCardDescriptionProps> = ({ description }) => {
  const [drop, setDrop] = React.useState(false);
  const [allowDrop, setAllowDrop] = React.useState(false);

  React.useEffect(() => {
    const segments = description?.split('\n');
    if (segments.length > 1) {
      setAllowDrop(true);
    }
  }, [description]);

  if (!description) return null;

  return (
    <Text size="md" style={{ lineHeight: '1.375rem' }}>
      {drop ? (
        <MdCard mdText={description} hasWrapper={false} />
      ) : (
        <MdCard mdText={description.split('\n').filter(_ => _)[0]} hasWrapper={false} />
      )}
      {allowDrop && (
        <StyledText onClick={() => setDrop(prevState => !prevState)}>
          {drop ? 'Show less' : 'Read more'}
        </StyledText>
      )}
    </Text>
  );
};

export default ICDetailCardDescription;
