export function sortByKey<T>(array: T[], key: string) {
  return array.slice().sort((a, b) => (a[key] || '').toString().localeCompare((b[key] || '').toString()));
}
