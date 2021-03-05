import * as React from 'react';
export declare const getEditableTextFieldHandlers: (
  editable: boolean,
  setEditField: React.Dispatch<React.SetStateAction<boolean>>,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: () => void,
) => {
  handleClick: () => false | void;
  handleBlur: () => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
};
export declare const getEditableImageFieldHandlers: (
  editable: boolean,
  imageRef: React.MutableRefObject<any>,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: (newValue: string) => void,
) => {
  handleClick: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
