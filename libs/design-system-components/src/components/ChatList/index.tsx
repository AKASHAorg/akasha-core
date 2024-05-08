import * as React from 'react';
import { tw } from '@twind/core';

import { IChatMessage } from '@akashaorg/typings/lib/ui';

import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ChatListProps = {
  emptyChatLabel: string;
  fetchingMessagesLabel?: string;
  unreadMessagesLabel?: string;
  loggedUserProfileId: string;
  itemCard: React.ReactElement;
  fetchingMessages?: boolean;
  markLatestMessagesRead?: () => void;
  oldMessages?: IChatMessage[];
  newMessages?: IChatMessage[];
};

const ChatList: React.FC<ChatListProps> = props => {
  const {
    emptyChatLabel,
    loggedUserProfileId,
    itemCard,
    oldMessages,
    newMessages,
    markLatestMessagesRead,
    fetchingMessages,
    fetchingMessagesLabel,
    unreadMessagesLabel,
  } = props;

  const chatBottomRef = React.useRef(null);
  const readMessagesBottomRef = React.useRef(null);

  const scrollToLatestReadMessage = () => {
    readMessagesBottomRef.current?.scrollIntoView();
  };

  React.useEffect(() => {
    scrollToLatestReadMessage();
  }, [oldMessages]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        markLatestMessagesRead();
      }
    });
    if (chatBottomRef?.current) {
      observer.observe(chatBottomRef?.current);
    }
    return () => observer.disconnect();
  }, [markLatestMessagesRead]);

  if (!oldMessages?.length && fetchingMessages) {
    return (
      <div className={tw(`h-[25rem] overflow-auto flex items-center justify-center`)}>
        <>
          <Spinner />
          <Text>{fetchingMessagesLabel}</Text>
        </>
      </div>
    );
  }

  return (
    <div className={tw(`h-[25rem] overflow-auto flex px-1`)}>
      {oldMessages.length < 1 && (
        <Text align="center" variant="body1" customStyle="mt-4">
          {emptyChatLabel}
        </Text>
      )}
      {oldMessages.length > 1 &&
        oldMessages.map((message: IChatMessage, id: number) => (
          <div
            className={tw(
              `w-[95%] my-2 flex min-h-min shrink-0 ${
                message.did.id !== loggedUserProfileId ? 'self-end' : 'self-start'
              }`,
            )}
            key={id}
          >
            {React.cloneElement(itemCard, {
              senderName: message.name,
              isRead: message.read,
              isFromLoggedUser: message.did.id === loggedUserProfileId,
              chatTimestamp: message.timestamp,
              content: message.content,
            })}
          </div>
        ))}

      <div ref={readMessagesBottomRef} />

      {newMessages?.length > 1 && (
        <div
          className={tw(
            `flex shrink-0 rounded-[100px] px-4 py-1 bg(secondaryLight/30 dark:secondaryDark/30)`,
          )}
        >
          <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {unreadMessagesLabel}
          </Text>
        </div>
      )}

      {newMessages?.length > 1 &&
        newMessages?.map((message: IChatMessage, index: number) => (
          <div
            key={index}
            className={tw(
              `w-[95%] my-2 flex min-h-min shrink-0 ${
                message.did.id !== loggedUserProfileId ? 'self-end' : 'self-start'
              }`,
            )}
            ref={index === newMessages.length - 1 ? chatBottomRef : null}
          >
            {React.cloneElement(itemCard, {
              senderName: message.name,
              isRead: message.read,
              isFromLoggedUser: message.did.id === loggedUserProfileId,
              chatTimestamp: message.timestamp,
              content: message.content,
            })}
          </div>
        ))}
      {/* <div ref={chatBottomRef} /> */}
    </div>
  );
};

export default ChatList;
