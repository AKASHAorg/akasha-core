import * as React from 'react';

export const getEditableTextFieldHandlers = (
  editable: boolean,
  setEditField: React.Dispatch<React.SetStateAction<boolean>>,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: () => void,
) => {
  const handleClick = () => editable && setEditField(true);
  const handleBlur = () => {
    if (editable) {
      setEditField(false);
      onChange();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNewValue(e.target.value);
  };

  return {
    handleClick,
    handleBlur,
    handleChange,
  };
};

export const getEditableImageFieldHandlers = (
  editable: boolean,
  imageRef: React.MutableRefObject<any>,
  setNewValue: React.Dispatch<React.SetStateAction<string>>,
  onChange: (newValue: string) => void,
) => {
  const handleClick = () => {
    if (editable && imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editable) {
      return;
    }

    if (!(e.target.files && e.target.files[0])) {
      setNewValue('');
      onChange('');

      return;
    }

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      const result = fileReader.result as string;

      setNewValue(result);
      onChange(result);
    });

    fileReader.readAsDataURL(file);
  };

  return {
    handleClick,
    handleChange,
  };
};
