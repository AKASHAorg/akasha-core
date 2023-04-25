import React from 'react';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import PageHeader, { IPageHeaderProps } from './page-header';
import { ActiveModerator } from '../../utils/dummy-data';

export interface IAssignAdminProps extends IPageHeaderProps {
  introLabel: string;
  searchPlaceholderLabel: string;
  assignButtonLabel: string;
  activeModerators: ActiveModerator[];
  onClickAssign: () => void;
}

const AssignAdmin: React.FC<IAssignAdminProps> = props => {
  const { introLabel, searchPlaceholderLabel, assignButtonLabel, activeModerators, onClickAssign } =
    props;

  const selectedModerator = activeModerators[0];

  return (
    <PageHeader {...props}>
      <Box customStyle="space-y-4">
        <Text>{introLabel}</Text>

        {props.showButtons ? (
          <Box customStyle="flex space-x-2 items-center">
            <Avatar src={selectedModerator.avatar} />

            <Box>
              <Text
                variant="button-md"
                weight="bold"
                truncate={true}
              >{`${selectedModerator.name}`}</Text>

              <Text
                variant="footnotes2"
                weight="normal"
                truncate={true}
                color={{ light: 'grey4', dark: 'grey7' }}
              >{`@${selectedModerator.userName}`}</Text>
            </Box>
          </Box>
        ) : (
          <Box customStyle="space-y-4">
            {activeModerators.map((moderator, idx) => (
              <React.Fragment key={moderator.userName}>
                <Box customStyle="flex justify-between">
                  <Box customStyle="flex space-x-2 items-center">
                    <Avatar src={moderator.avatar} />

                    <Box>
                      <Text
                        variant="button-md"
                        weight="bold"
                        truncate={true}
                      >{`${moderator.name}`}</Text>

                      <Text
                        variant="footnotes2"
                        weight="normal"
                        truncate={true}
                        color={{ light: 'grey4', dark: 'grey7' }}
                      >{`@${moderator.userName}`}</Text>
                    </Box>
                  </Box>

                  <Button label={assignButtonLabel} onClick={onClickAssign} />
                </Box>

                {idx < activeModerators.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        )}
      </Box>
    </PageHeader>
  );
};

export default AssignAdmin;
