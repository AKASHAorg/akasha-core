import * as React from 'react';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface IRelativeTime {
  className?: string;
  timestamp: number;
}

const RelativeTime: React.FC<IRelativeTime> = props => {
  const { timestamp, className } = props;

  const [relativeTime, setRelativeTime] = React.useState('');

  let interval: ReturnType<typeof setInterval> | undefined;

  React.useEffect(() => {
    parseRelativeTime(timestamp);

    if (!interval) {
      const timeDifference = Date.now() - timestamp;
      interval = setInterval(parseRelativeTime, determineIntervalDelay(timeDifference));
    }
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
    };
  });

  const determineIntervalDelay = (timeDifference: number) => {
    // Update every half a second if time difference in the seconds
    if (timeDifference < MINUTE) {
      return 500;
    }
    // Update every 10 seconds if time difference in the minutes
    if (timeDifference < HOUR) {
      return 10 * 1000;
    }
    // Update every 5 minutes if time difference in the hours
    if (timeDifference < DAY) {
      return 5 * MINUTE;
    }
    // Else update every hour
    return 24 * HOUR;
  };

  const parseRelativeTime = (date: number) => {
    const nextRelativeTime = date ? formatDifference(date) : '';
    if (nextRelativeTime === relativeTime) {
      return;
    }
    setRelativeTime(nextRelativeTime);
  };

  const formatDifference = (then: number, now: number = Date.now()) => {
    const suffix = now - then < 0 ? 'from now' : 'ago';
    const [readableDifference, unit] = parseDiffAndUnit(Math.abs(now - then));

    return `${readableDifference} ${unit} ${suffix}`;
  };

  const parseDiffAndUnit = (timeDifference: number) => {
    let readableDifference;
    let unit;
    if (timeDifference < MINUTE) {
      readableDifference = Math.floor(timeDifference / 1000);
      unit = readableDifference === 1 ? 'second' : 'seconds';
      return [readableDifference !== 1 ? readableDifference : 'a', unit];
    }
    if (timeDifference < HOUR) {
      readableDifference = Math.floor(timeDifference / 1000 / 60);
      unit = readableDifference === 1 ? 'minute' : 'minutes';
      return [readableDifference !== 1 ? readableDifference : 'a', unit];
    }
    if (timeDifference < DAY) {
      readableDifference = Math.floor(timeDifference / 1000 / 60 / 60);
      unit = readableDifference === 1 ? 'hour' : 'hours';
      return [readableDifference !== 1 ? readableDifference : 'an', unit];
    }
    readableDifference = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
    unit = readableDifference === 1 ? 'day' : 'days';
    return [readableDifference !== 1 ? readableDifference : 'a', unit];
  };

  return <div className={className}>{relativeTime}</div>;
};

export { RelativeTime };
