import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/ro';

export type ILocale = 'es' | 'ro' | 'en';

const formatDate = (date: any, locale?: ILocale) => {
  if (dayjs(date).isValid()) {
    if (locale) {
      return dayjs
        .unix(date)
        .locale(locale)
        .format('D MMMM YYYY  H[h]mm');
    }
    return dayjs.unix(date).format('D MMMM YYYY  H[h]mm');
  }
  return '';
};

export { formatDate };
