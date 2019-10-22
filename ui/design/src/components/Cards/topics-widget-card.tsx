import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Box } from 'grommet';
import { IconType } from '../Icon/index';
import { BasicCardBox } from './index';
import TextIcon from '../TextIcon/index';
import SubtitleTextIcon from '../TextIcon/subtitle-text-icon';

export interface ITopicsCardWidgetProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  title: string;
  titleColor?: string;
  iconType: IconType;
  dataSource: { title: string; subtitle: string }[];
}

const TopicsWidgetCard: React.FC<ITopicsCardWidgetProps> = props => {
  const { onClick, margin, iconType, title, titleColor, dataSource } = props;

  return (
    <BasicCardBox>
      <Box pad="medium" gap="medium">
        <TextIcon
          iconType={iconType}
          label={title}
          onClick={onClick}
          margin={margin}
          color={titleColor}
          clickable
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

TopicsWidgetCard.defaultProps = {
  titleColor: 'primaryText',
};

export default TopicsWidgetCard;
