import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo } from 'react';

dayjs.extend(relativeTime);

export const useTimeDifference = (
  timestamp: string,
  isStory?: boolean
): string => {
  const timeDifference = useMemo(() => {
    const timestampDate = dayjs(timestamp);
    const currentDate = dayjs();
    const differenceSec = currentDate.diff(timestampDate, 'second');
    const differenceMinutes = currentDate.diff(timestampDate, 'minute');
    const differenceHour = currentDate.diff(timestampDate, 'hour');
    const differenceDay = currentDate.diff(timestampDate, 'day');
    const differenceWeek = currentDate.diff(timestampDate, 'week');
    const differenceMonth = currentDate.diff(timestampDate, 'month');
    const differenceYear = currentDate.diff(timestampDate, 'year');
    if (differenceSec < 60) return 'Just now';
    if (differenceMinutes < 60)
      return `${differenceMinutes}${
        isStory ? 'm' : differenceMinutes === 1 ? ' min ago' : ' mins ago'
      }`;
    if (differenceHour < 24)
      return `${differenceHour}${
        isStory ? 'h' : differenceHour === 1 ? ' hour ago' : ' hours ago'
      }`;
    if (differenceHour < 48)
      return isStory ? `${differenceHour} h` : 'Yesterday';
    if (differenceDay < 7)
      return `${differenceDay} ${differenceDay === 1 ? 'day ago' : 'days ago'}`;
    if (differenceWeek < 4)
      return `${differenceWeek} ${
        differenceWeek === 1 ? 'week ago' : 'weeks ago'
      }`;
    if (differenceMonth < 12)
      return `${differenceMonth} ${
        differenceMonth === 1 ? 'month ago' : 'months ago'
      }`;
    return `${differenceYear} ${
      differenceYear === 1 ? 'year ago' : 'years ago'
    }`;
  }, [isStory, timestamp]);
  return timeDifference;
};
