import * as React from 'react';
export interface IDropzone {
  onDrop: (acceptedFiles: File[]) => void;
  accept: string;
  dropzoneLabel?: string;
}
export declare const Dropzone: React.FC<IDropzone>;
