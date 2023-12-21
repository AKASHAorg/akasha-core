import * as React from 'react';
import type { SingleSpaRoutingEvent } from '@akashaorg/typings/lib/ui';

export const useRoutingEvents = () => {
  const [currentLocation, setCurrentLocation] = React.useState<Location>(window.location);

  React.useEffect(() => {
    window.addEventListener('single-spa:before-routing-event', (ev: SingleSpaRoutingEvent) => {
      if (ev.detail.newUrl !== ev.detail.oldUrl) {
        setCurrentLocation({ ...window.location, href: ev.detail.newUrl });
      }
    });
  }, []);

  return currentLocation;
};
