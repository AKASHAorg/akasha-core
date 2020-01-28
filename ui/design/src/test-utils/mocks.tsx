export interface MockFileReader {
  result: string;
  onerror(): void;
  onload(): void;
  readAsDataURL(): void;
}

export interface WindowWithFileReader extends Window {
  FileReader: any;
}

export class MockFileReader {
  // tslint:disable-next-line: no-empty
  public onerror() {}
  // tslint:disable-next-line: no-empty
  public onload() {}
  public readAsDataURL() {
    this.result = 'test-file-content-result';
    this.onload();
  }
}
