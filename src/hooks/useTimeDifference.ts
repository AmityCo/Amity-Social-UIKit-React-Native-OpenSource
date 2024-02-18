import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

dayjs.extend(relativeTime);

export const useTimeDifference = (timestamp: string): string => {
  const timeDifference = useMemo(() => {
    const timestampDate = dayjs(timestamp);
    const currentDate = dayjs();
    const differenceSec = currentDate.diff(timestampDate, 'second');
    const differenceMinutes = currentDate.diff(timestampDate, 'minute');
    const differenceHour = currentDate.diff(timestampDate, 'hour');
    const differenceDay = currentDate.diff(timestampDate, 'day');
    const differenceYear = currentDate.diff(timestampDate, 'year');

    if (differenceSec < 60) return 'Just now';
    if (differenceMinutes < 60)
      return `${differenceMinutes} ${
        differenceMinutes === 1 ? 'min ago' : 'mins ago'
      }`;
    if (differenceHour < 24)
      return `${differenceHour} ${
        differenceHour === 1 ? 'hour ago' : 'hours ago'
      }`;
    if (differenceDay < 365)
      return `${differenceDay} ${differenceDay === 1 ? 'day ago' : 'days ago'}`;
    return `${differenceYear} ${
      differenceYear === 1 ? 'year ago' : 'years ago'
    }`;
  }, [timestamp]);
  return timeDifference;
};
