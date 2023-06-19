import React from 'react';
import { apply, tw } from '@twind/core';
import Avatar from '../Avatar';
import Button from '../Button';
import Accordion from '../Accordion';

export interface ISidebarProps {
  guestTitle: string;
  guestSubtitle: string;
  ctaText: string;
  ctaButtonLabel: string;
  footerLabel: string;
  loggedUser: Record<string, string>;
  listItems: Record<string, any>[];
  footerIcons: Record<string, any>[];
}

const Sidebar: React.FC<ISidebarProps> = props => {
  const {
    guestTitle,
    guestSubtitle,
    ctaText,
    ctaButtonLabel,
    footerLabel,
    listItems,
    footerIcons,
  } = props;

  const guestPofileId = 'did:pkh:eip155:1:0x00000000000000000000000000000';

  const titleText = apply('text-sm font-bold');

  const subtitleText = apply('text-xs text-grey5');

  const avatar = {
    default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
  };

  return (
    <div className={tw('h-screen bg-white dark:bg-grey2 rounded-[20px]')}>
      <div className={tw('flex flex-row p-4 border-b-1 border-grey8')}>
        <div className={tw('w-fit h-fit mr-2')}>
          <Avatar profileId={guestPofileId} avatar={avatar} />
        </div>
        <div className={tw('w-fit pr-10')}>
          <p className={tw(titleText)}>{guestTitle}</p>
          <p className={tw(subtitleText)}>{guestSubtitle}</p>
        </div>
        <div className={tw('w-fit h-fit ml-6 self-end')}>
          <Button icon="BoltIcon" variant="primary" iconOnly={true} />
        </div>
      </div>

      <div className={tw('flex flex-col p-4')}>
        {listItems.map((item, idx) => (
          <React.Fragment key={item.title + idx}>
            {item.submenu ? (
              <Accordion
                titleNode={
                  <div className={tw('flex flex-row items-center')}>
                    <Avatar avatar={avatar} />
                    <p className={tw('ml-2.5 text-black dark:text-white')}>{item.title}</p>
                  </div>
                }
                contentNode={<></>}
              />
            ) : (
              <div className={tw('flex flex-row items-center p-2 cursor-pointer')}>
                <Avatar avatar={avatar} />
                <p className={tw('ml-2.5 text-black dark:text-white')}>{item.title}</p>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={tw('flex flex-col px-8 py-4 bg-grey8')}>
        <p className={tw(subtitleText)}>{ctaText}</p>
        <div className={tw('w-fit h-fit mt-6')}>
          <Button label={ctaButtonLabel} variant="primary" />
        </div>
      </div>

      <div className={tw('flex flex-col px-8 py-4')}>
        <p className={tw(subtitleText)}>{footerLabel}</p>
        <div className={tw('flex w-fit h-fit mt-6')}>
          {footerIcons.map((icon, idx) => (
            <div key={icon.name + idx} className={tw('mr-4')}>
              <Button icon={icon.name} greyBg={true} variant="primary" iconOnly={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
