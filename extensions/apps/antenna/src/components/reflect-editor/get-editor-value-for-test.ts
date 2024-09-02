/*
 * Currently jsdom doesn't support contenteditable and as a result slate editor can't be tested in jsdom.
 * As a work around, the following function is used to mock editor value for tests,
 * and for real use case the value remains as empty.
 **/
export function getEditorValueForTest(): string | string[] {
  return '';
}
