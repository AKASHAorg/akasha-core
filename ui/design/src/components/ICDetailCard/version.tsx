import * as React from 'react';
import { Box, Text, Drop } from 'grommet';
import Icon from '../Icon';

export interface VersionProps {
  version?: string;
  releaseId?: string;
}

const Version: React.FC<VersionProps> = props => {
  const { version, releaseId } = props;
  const targetRef = React.useRef();
  const [showDrop, setShowDrop] = React.useState(false);
  return (
    <Box direction="row" gap="small">
      <Text>{version}</Text>
      <Icon
        ref={targetRef}
        size="xs"
        type="info"
        accentColor={true}
        clickable={true}
        onClick={() => setShowDrop(!showDrop)}
      />
      {showDrop && targetRef.current && (
        <Drop
          margin={{ left: 'xsmall' }}
          align={{ left: 'right' }}
          target={targetRef.current}
          onClickOutside={() => setShowDrop(false)}
        >
          <Box background="activePanelBackground" round="xsmall" pad="xsmall">
            <Text>{releaseId}</Text>
          </Box>
        </Drop>
      )}
    </Box>
  );
};

export default Version;
