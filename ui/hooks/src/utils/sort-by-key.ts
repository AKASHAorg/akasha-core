export function sortByKey<T>(array: T[], key: string) {
  // slice is required because the sort modifies the original array
  return array
    .slice()
    .sort((a, b) => (a[key] || '').toString().localeCompare((b[key] || '').toString()));
}
