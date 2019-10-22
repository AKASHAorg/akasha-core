import { Box } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { IconType } from '../Icon/index';
import TextIcon from '../TextIcon/index';
import SubtitleTextIcon from '../TextIcon/subtitle-text-icon';
import { BasicCardBox } from './index';

export interface ITopicsCardWidgetProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  label: string;
  labelColor?: string;
  iconType: IconType;
  dataSource: { title: string; subtitle: string }[];
}

const TopicsWidgetCard: React.FC<ITopicsCardWidgetProps> = props => {
  const { onClick, margin, iconType, label, labelColor, dataSource } = props;

  return (
    <BasicCardBox>
      <Box pad="medium" gap="medium">
        <TextIcon
          iconType={iconType}
          label={label}
          onClick={onClick}
          margin={margin}
          color={labelColor}
          clickable={true}
        />
        <Box pad="none" align="start" gap="large">
          {dataSource.map(({ title, subtitle }, index) => (
            <SubtitleTextIcon
              title={title}
              subtitle={subtitle}
              titleColor="accentText"
              titleSize="large"
              gap="xxsmall"
              key={index}
            />
          ))}
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default TopicsWidgetCard;
