import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { tw } from '@twind/core';

const MentionElement = (props: any) => {
  const { handleMentionClick, attributes, element, children } = props;
  const mention = element.userName || element.name || element.ethAddress;
  const displayedMention = mention && mention.startsWith('@') ? mention : `@${mention}`;
  return (
    <button
      className={tw(`text-secondaryLight dark:text-secondaryDark`)}
      {...attributes}
      contentEditable={false}
      onClick={(ev: Event) => {
        handleMentionClick(element.did.id);
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      {displayedMention}
      {children}
    </button>
  );
};

const TagElement = ({ attributes, children, element, handleTagClick }: any) => {
  return (
    <button
      className={tw(`text-secondaryLight dark:text-secondaryDark`)}
      {...attributes}
      contentEditable={false}
      onClick={(ev: Event) => {
        handleTagClick(element.name);
        ev.stopPropagation();
      }}
    >
      #{element.name}
      {children}
    </button>
  );
};

const LinkElement = ({ attributes, children, element, handleLinkClick }: any) => {
  return (
    <a
      className={tw(`text-secondaryLight dark:text-secondaryDark no-underline`)}
      {...attributes}
      contentEditable={false}
      href={element.url as string}
      size="large"
      target="_blank"
      rel="noopener noreferrer"
      onClick={(ev: Event) => {
        if (new URL(element.url).origin === window.location.origin) {
          handleLinkClick(element.url);
          ev.stopPropagation();
          ev.preventDefault();
          return false;
        }
        return ev.stopPropagation();
      }}
    >
      {element.url}
      {children}
    </a>
  );
};

const renderElement = (
  props: RenderElementProps,
  handleMentionClick?: (id: string) => void,
  handleTagClick?: (name: string) => void,
  handleLinkClick?: (url: string) => void,
) => {
  switch (props.element.type) {
    case 'mention':
      return <MentionElement handleMentionClick={handleMentionClick} {...props} />;
    case 'tag':
      return <TagElement handleTagClick={handleTagClick} {...props} />;
    case 'link':
      return <LinkElement handleLinkClick={handleLinkClick} {...props} />;

    default:
      return (
        <p className={tw(`text-black dark:text-white`)} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let textStyle = 'text-black dark:text-white';
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.disabled) {
    textStyle = `text-color-grey8`;
  }

  return (
    <span className={tw(textStyle)} {...attributes}>
      {children}
    </span>
  );
};

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

export { renderElement, renderLeaf };
