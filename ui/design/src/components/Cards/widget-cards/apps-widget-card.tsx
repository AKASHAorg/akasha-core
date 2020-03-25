import { Box } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { IconType } from '../../Icon/icon';
import { SubtitleTextIcon, TextIcon } from '../../TextIcon/index';
import { WidgetAreaCardBox } from '../common/basic-card-box';

export interface IAppsWidgetCardProps {
  className?: string;
  onClick: () => void;
  margin?: MarginInterface;
  label: string;
  labelColor?: string;
  iconType: IconType;
  dataSource: IAppData[];
  onAppClick: (appData: IAppData) => void;
}

export interface IAppData {
  title: string;
  subtitle: string;
  appIconType: IconType;
  iconSize: string;
}

const AppsWidgetCard: React.FC<IAppsWidgetCardProps> = props => {
  const { className, onClick, margin, iconType, label, labelColor, dataSource, onAppClick } = props;

  const appClickHandler = (appData: IAppData) => () => {
    onAppClick(appData);
  };

  return (
    <WidgetAreaCardBox className={className}>
      <Box pad="medium" gap="medium">
        <TextIcon
          iconType={iconType}
          label={label}
          onClick={onClick}
          margin={margin}
          clickable={true}
          color={labelColor}
          bold={true}
        />
        <Box pad="none" align="start" gap="large">
          {dataSource.map((appData, index) => (
            <SubtitleTextIcon
              onClick={appClickHandler(appData)}
              label={appData.title}
              subtitle={appData.subtitle}
              labelSize="large"
              key={index}
              iconType={appData.appIconType}
              iconSize={appData.iconSize}
              gap="xxsmall"
            />
          ))}
        </Box>
      </Box>
    </WidgetAreaCardBox>
  );
};

export default AppsWidgetCard;
