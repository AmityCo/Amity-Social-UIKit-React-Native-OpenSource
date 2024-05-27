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
    const differenceMonth = currentDate.diff(timestampDate, 'month');
    if (differenceSec < 60) return 'Just now';
    if (differenceMinutes < 60) return `${differenceMinutes}m`;
    if (differenceHour < 24) return `${differenceHour}h`;
    if (differenceDay < 7) return `${differenceDay}d`;
    if (differenceMonth < 12) {
      const formattedMonthDate = timestampDate.format('D MMMM');
      return formattedMonthDate;
    }
    const formattedYearMonthDate = timestampDate.format('D MMMM YYYY');
    return formattedYearMonthDate;
  }, [timestamp]);
  return timeDifference;
};
