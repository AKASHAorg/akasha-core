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
  title: string;
  titleColor?: string;
  iconType: IconType;
  dataSource: Array<{ title: string; subtitle: string; iconType: IconType; iconSize: string }>;
}

const AppsWidgetCard: React.FC<IAppsWidgetCardProps> = props => {
  const { onClick, margin, iconType, title, titleColor, dataSource } = props;

  return (
    <BasicCardBox>
      <Box pad="medium" gap="medium">
        <TextIcon iconType={iconType} label={title} onClick={onClick} margin={margin} clickable={true} />
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
