import { Box, Text } from 'grommet';
import * as React from 'react';
import { formatDateShort } from '../../utils/time';
import Button from '../Button';
import IconLink from '../IconLink';
import Icon from '../Icon';
import { WidgetAreaCardBox } from '../EntryCard/basic-card-box';
import { StyledText } from './styled-widget-cards';

export interface IAppsWidgetCardProps {
  className?: string;
  appInfo: IAppInfo;
  versionLabel: string;
  statusLabel: string;
  lastUpdateLabel: string;
  submittedLabel: string;
  adminLabel: string;
  categoryLabel: string;
  receiveUpdatesLabel: string;
  subscribeLabel: string;
  unsubscribeLabel: string;
  reportLabel: string;
  handleSubscribe: () => void;
  handleRecommend?: () => void;
  handleReport?: () => void;
}

export interface IAppInfo {
  name: string;
  version: string;
  status: string;
  lastUpdateDate: string;
  registryDate: string;
  admin: string;
  category: string;
}

const AppInfoWidgetCard: React.FC<IAppsWidgetCardProps> = props => {
  const {
    className,
    appInfo,
    versionLabel,
    statusLabel,
    lastUpdateLabel,
    submittedLabel,
    adminLabel,
    categoryLabel,
    receiveUpdatesLabel,
    subscribeLabel,
    // unsubscribeLabel,
    reportLabel,
    handleSubscribe,
    handleReport,
  } = props;

  return (
    <WidgetAreaCardBox className={className}>
      <Box
        margin={{ horizontal: 'medium' }}
        border={{
          color: 'border',
          size: 'xsmall',
          style: 'solid',
          side: 'bottom',
        }}
        direction="column"
      >
        <Box direction="row" fill="horizontal" pad={{ vertical: 'xsmall' }}>
          <Box direction="column" gap="xsmall" fill="horizontal">
            <StyledText size="small" color="secondaryText">
              {versionLabel}
            </StyledText>
            <Text>{appInfo.version}</Text>
          </Box>
          <Box direction="column" gap="xsmall" fill="horizontal">
            <StyledText size="small" color="secondaryText">
              {statusLabel}
            </StyledText>
            <Text>{appInfo.status}</Text>
          </Box>
        </Box>
        <Box direction="row" fill="horizontal" pad={{ vertical: 'xsmall' }}>
          <Box direction="column" gap="xsmall" fill="horizontal">
            <StyledText size="small" color="secondaryText">
              {lastUpdateLabel}
            </StyledText>
            <Text>{formatDateShort(appInfo.lastUpdateDate)}</Text>
          </Box>
          <Box direction="column" gap="xsmall" fill="horizontal">
            <StyledText size="small" color="secondaryText">
              {submittedLabel}
            </StyledText>
            <Text>{formatDateShort(appInfo.registryDate)}</Text>
          </Box>
        </Box>
        <Box direction="row" fill="horizontal" pad={{ vertical: 'xsmall' }}>
          <Box direction="column" gap="xsmall" fill="horizontal">
            <StyledText size="small" color="secondaryText">
              {adminLabel}
            </StyledText>
            <Text>{appInfo.admin}</Text>
          </Box>
        </Box>
        <Box direction="row" fill="horizontal" pad={{ vertical: 'xsmall' }}>
          <Box direction="column" gap="xsmall" fill="horizontal">
            <StyledText size="small" color="secondaryText">
              {categoryLabel}
            </StyledText>
            <Text>{appInfo.category}</Text>
          </Box>
        </Box>
      </Box>
      <Box direction="column" gap="small" pad="medium">
        <Text>{`${receiveUpdatesLabel} ${appInfo.name}`}</Text>
        <Button label={subscribeLabel} onClick={handleSubscribe} />
        <IconLink
          icon={<Icon type="report" color="border" />}
          label={reportLabel}
          onClick={handleReport}
          size="medium"
        />
      </Box>
    </WidgetAreaCardBox>
  );
};

export default AppInfoWidgetCard;
