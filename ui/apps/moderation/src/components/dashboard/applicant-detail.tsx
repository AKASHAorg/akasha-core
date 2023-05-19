import React from 'react';

import { ModeratorApplicantData } from '@akashaorg/typings/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

export interface IApplicantDetailProps {
  selectedApplicant: ModeratorApplicantData;
  viewProfileLabel: string;
  onButtonClick: (route?: string) => () => void;
}

const ApplicantDetail: React.FC<IApplicantDetailProps> = props => {
  const { selectedApplicant, viewProfileLabel, onButtonClick } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <BasicCardBox pad="p-0">
      <Box customStyle="flex justify-between items-center p-4">
        <Box customStyle="flex space-x-2 items-start">
          <Avatar src={selectedApplicant.avatar} />

          <Box>
            <Tooltip content={selectedApplicant.name} placement="right">
              <Text variant="body2" weight="bold" truncate={true} customStyle={textStyle}>
                {selectedApplicant.name}
              </Text>
            </Tooltip>

            <Tooltip content={`@${selectedApplicant.userName}`} placement="right">
              <Text
                variant="button-md"
                weight="normal"
                truncate={true}
                customStyle={textStyle}
                color={{ light: 'grey4', dark: 'grey7' }}
              >
                @{selectedApplicant.userName}
              </Text>
            </Tooltip>
          </Box>
        </Box>

        <Button label={viewProfileLabel} customStyle="self-end mt-3" onClick={onButtonClick()} />
      </Box>
    </BasicCardBox>
  );
};

export default ApplicantDetail;
