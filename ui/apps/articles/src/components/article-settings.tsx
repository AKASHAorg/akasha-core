import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';

export interface IArticlesSettingsProps {
  titleLabel: string;
  searchKeyword?: string;
  inputPlaceholderLabel: string;
  subscribedTopicsTitleLabel: string;
  subscribedTopicsSubtitleLabel: string;
  subscribedTopics: string[];
  uninstallLabel: string;
  onClickCloseSettings: () => void;
  onSearch: () => void;
  onClickTopic: (topic: string) => () => void;
  onClickUninstall: () => void;
}

const ArticlesSettings: React.FC<IArticlesSettingsProps> = props => {
  const {
    titleLabel,
    searchKeyword = '',
    inputPlaceholderLabel,
    subscribedTopicsTitleLabel,
    subscribedTopicsSubtitleLabel,
    subscribedTopics,
    uninstallLabel,
    onClickCloseSettings,
    onSearch,
    onClickTopic,
    onClickUninstall,
  } = props;

  const [inputValue, setInputValue] = React.useState<string>(searchKeyword);

  return (
    <Card>
      <Box customStyle="flex flex-row w-full p-4 border(b grey8 dark:grey3)">
        <button onClick={onClickCloseSettings}>
          <Icon type="XMarkIcon" />
        </button>
        <Text variant="h2" customStyle="mx-auto">
          {titleLabel}
        </Text>
      </Box>
      <Box customStyle="flex w-full px-4 pt-4 items-center">
        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={onSearch}
          searchInputSize="large"
          iconSize="sm"
        />
      </Box>
      <Box customStyle="flex p-4 border(b grey8 dark:grey3) gap-1">
        <Text variant="h2">{subscribedTopicsTitleLabel}:</Text>
        <Text variant="subtitle2">{subscribedTopicsSubtitleLabel}</Text>
        <Box customStyle="flex flex-row flex-wrap gap-1">
          {subscribedTopics.map((topic, idx) => (
            <button key={idx} onClick={onClickTopic(topic)}>
              <Box customStyle="flex flex-row rounded-lg gap-0.5 border(secondaryLight dark:secondaryDark)">
                <Text>{topic}</Text>
                <Icon type="XMarkIcon" />
              </Box>
            </button>
          ))}
        </Box>
      </Box>
      <Box customStyle="flex flex-row w-full justify-end items-center p-4">
        <Button size="lg" icon="XMarkIcon" label={uninstallLabel} onClick={onClickUninstall} />
      </Box>
    </Card>
  );
};

export default ArticlesSettings;
