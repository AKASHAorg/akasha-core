import { Box } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { IconType } from '../../Icon/icon';
import { SubtitleTextIcon, TextIcon } from '../../TextIcon/index';
import { BasicCardBox } from '../index';

export interface ITopicsCardWidgetProps {
  onClick: () => void;
  onTopicClick: (topic: ITopicData) => void;
  margin?: MarginInterface;
  label: string;
  labelColor?: string;
  iconType: IconType;
  dataSource: ITopicData[];
}

export interface ITopicData {
  title: string;
  subtitle: string;
}

const TopicsWidgetCard: React.FC<ITopicsCardWidgetProps> = props => {
  const { onClick, onTopicClick, margin, iconType, label, labelColor, dataSource } = props;

  const topicClickHandler = (topicData: ITopicData) => () => {
    onTopicClick(topicData);
  };

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
          bold={true}
        />
        <Box pad="none" align="start" gap="large">
          {dataSource.map((topicData, index) => (
            <SubtitleTextIcon
              onClick={topicClickHandler(topicData)}
              label={topicData.title}
              subtitle={topicData.subtitle}
              labelColor="accentText"
              labelSize="large"
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
