import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'MMM YYYY') => {
  return dayjs(date).format(format);
};
