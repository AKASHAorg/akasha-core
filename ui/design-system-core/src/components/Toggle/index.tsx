import React, { useState, PropsWithChildren } from 'react';
import { Switch } from '@headlessui/react';

import { tw, apply } from '@twind/core';

export type ToggleProps = {
  disabled?: boolean;
};

export const Toggle: React.FC<PropsWithChildren<ToggleProps>> = props => {
  const { disabled } = props;
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch.Group>
      <div className={tw('flex items-center')}>
        <Switch.Label className={tw('mr-4')}>Enable notifications</Switch.Label>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={tw(
            `${
              enabled ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`,
          )}
        >
          <span
            className={tw(
              `${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`,
            )}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};
