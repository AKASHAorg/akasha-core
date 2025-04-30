import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import { ReadOnlyEditor } from '@akashaorg/ui-lib-feed';
import {
  decodeb64SlateContent,
  triggerNavigation,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';

export const SlateReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const content = decodeb64SlateContent(props.content.value, props.logger);

  const { getCorePlugins } = useRootComponentProps();

  const navigateTo = React.useRef(getCorePlugins().routing.navigateTo);

  const handleMentionClick = profileDID => {
    navigateTo?.current({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileDID}`,
    });
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={() => {
        triggerNavigation();
      }}
      role="button"
      tabIndex={0}
    >
      <ReadOnlyEditor content={content} handleMentionClick={handleMentionClick} />
    </div>
  );
};
