import * as React from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { tw, apply } from '@twind/core';
import { ImageElement } from '@akashaorg/typings/lib/ui';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

const closeDivClass = apply(
  'flex items-center justify-items-center z-1 w-6 h-6 rounded-full bg-grey7',
);

const ImgElement = ({
  attributes,
  children,
  element,
  handleDeleteImage,
  handleClickImage,
}: any) => {
  return (
    <div
      {...attributes}
      onClick={ev => {
        if (handleClickImage && typeof handleClickImage === 'function') {
          handleClickImage(element);
        }
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      <div
        role="img"
        aria-label={element.url}
        contentEditable={false}
        style={{
          minHeight: 30,
          height: 'fit-content',
          width: 'fit-content',
          position: 'relative',
          overflow: 'hidden',
          contain: 'layout',
        }}
      >
        {handleDeleteImage && (
          <div
            className={closeDivClass}
            onClick={ev => {
              if (handleDeleteImage && typeof handleDeleteImage === 'function') {
                handleDeleteImage(element);
              }
              ev.stopPropagation();
              ev.preventDefault();
              return false;
            }}
          >
            <Icon type="XMarkIcon" />
          </div>
        )}
        <picture className={tw(`flex`)}>
          <source srcSet={element.url} />
          <img className={tw(`block max-w-full rounded-lg`)} src={element.fallbackUrl} />
        </picture>
      </div>
      {children}
    </div>
  );
};

const MentionElement = (props: any) => {
  const { handleMentionClick, attributes, element, children } = props;
  const mention = element.userName || element.name || element.ethAddress;
  const displayedMention = mention && mention.startsWith('@') ? mention : `@${mention}`;
  return (
    <span
      className={tw(`cursor-pointer text-secondaryLight dark:text-secondaryDark`)}
      {...attributes}
      contentEditable={false}
      onClick={(ev: Event) => {
        handleMentionClick(element.pubKey);
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      }}
    >
      {displayedMention}
      {children}
    </span>
  );
};

const TagElement = ({ attributes, children, element, handleTagClick }: any) => {
  return (
    <span
      className={tw(`cursor-pointer text-secondaryLight dark:text-secondaryDark`)}
      {...attributes}
      contentEditable={false}
      onClick={(ev: Event) => {
        handleTagClick(element.name);
        ev.stopPropagation();
      }}
    >
      #{element.name}
      {children}
    </span>
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
  handleMentionClick?: (pubKey: string) => void,
  handleTagClick?: (name: string) => void,
  handleLinkClick?: (url: string) => void,
  handleDeleteImage?: ((element: ImageElement) => void) | null,
  handleClickImage?: (element: ImageElement) => void,
) => {
  switch (props.element.type) {
    case 'image':
      return (
        <ImgElement
          handleDeleteImage={handleDeleteImage}
          handleClickImage={handleClickImage}
          {...props}
        />
      );
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
  if (leaf.bold) {
    return (
      <span className={tw(`text-black dark:text-white`)} {...attributes}>
        <strong>{children}</strong>
      </span>
    );
  }

  if (leaf.italic) {
    return (
      <span className={tw(`text-black dark:text-white`)} {...attributes}>
        <em>{children}</em>
      </span>
    );
  }

  if (leaf.underlined) {
    return (
      <span className={tw(`text-black dark:text-white`)} {...attributes}>
        <u>{children}</u>
      </span>
    );
  }

  if (leaf.code) {
    return (
      <span className={tw(`text-black dark:text-white`)} {...attributes}>
        <code>{children}</code>
      </span>
    );
  }

  if (leaf.disabled) {
    return (
      <span className={tw(`text-color-grey8`)} {...attributes}>
        {children}
      </span>
    );
  }

  return (
    <span className={tw(`text-black dark:text-white`)} {...attributes}>
      {children}
    </span>
  );
};

const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

export { renderElement, renderLeaf };
