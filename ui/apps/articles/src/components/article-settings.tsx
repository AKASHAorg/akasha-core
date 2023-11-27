import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack direction="row" fullWidth={true} customStyle="p-4 border(b grey8 dark:grey3)">
        <button onClick={onClickCloseSettings}>
          <Icon icon={<XMarkIcon />} />
        </button>
        <Text variant="h2" customStyle="mx-auto">
          {titleLabel}
        </Text>
      </Stack>
      <Stack fullWidth={true} align="center" customStyle="px-4 pt-4">
        <SearchBar
          inputValue={inputValue}
          inputPlaceholderLabel={inputPlaceholderLabel}
          onInputChange={ev => setInputValue(ev.target.value)}
          onSearch={onSearch}
          searchInputSize="large"
          iconSize="sm"
        />
      </Stack>
      <Stack spacing="gap-1" customStyle="p-4 border(b grey8 dark:grey3)">
        <Text variant="h2">{subscribedTopicsTitleLabel}:</Text>
        <Text variant="subtitle2">{subscribedTopicsSubtitleLabel}</Text>
        <Stack direction="row" spacing="gap-1" customStyle="flex-wrap">
          {subscribedTopics.map((topic, idx) => (
            <button key={idx} onClick={onClickTopic(topic)}>
              <Stack
                direction="row"
                spacing="gap-0.5"
                customStyle="rounded-lg border(secondaryLight dark:secondaryDark)"
              >
                <Text>{topic}</Text>
                <Icon icon={<XMarkIcon />} />
              </Stack>
            </button>
          ))}
        </Stack>
      </Stack>
      <Stack direction="row" fullWidth={true} align="center" justify="end" customStyle="p-4">
        <Button size="lg" icon={<XMarkIcon />} label={uninstallLabel} onClick={onClickUninstall} />
      </Stack>
    </Card>
  );
};

export default ArticlesSettings;
