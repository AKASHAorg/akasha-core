import { Box } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { IconType } from '../Icon/index';
import TextIcon from '../TextIcon/index';
import SubtitleTextIcon from '../TextIcon/subtitle-text-icon';
import { BasicCardBox } from './index';

export interface IAppsWidgetCardProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  label: string;
  labelColor?: string;
  iconType: IconType;
  dataSource: Array<{ title: string; subtitle: string; iconType: IconType; iconSize: string }>;
}

const AppsWidgetCard: React.FC<IAppsWidgetCardProps> = props => {
  const { onClick, margin, iconType, label, labelColor, dataSource } = props;

  return (
    <BasicCardBox>
      <Box pad="medium" gap="medium">
        <TextIcon
          iconType={iconType}
          label={label}
          onClick={onClick}
          margin={margin}
          clickable={true}
          color={labelColor}
        />
        <Box pad="none" align="start" gap="large">
          {dataSource.map(({ title, subtitle, iconType, iconSize }, index) => (
            <SubtitleTextIcon
              title={title}
              subtitle={subtitle}
              titleSize="large"
              key={index}
              iconType={iconType}
              iconSize={iconSize}
              gap="xxsmall"
            />
          ))}
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default AppsWidgetCard;
