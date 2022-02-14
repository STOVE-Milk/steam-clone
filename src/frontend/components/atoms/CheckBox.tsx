import React from 'react';
import Text from 'components/atoms/Text';

export interface ICheckBoxProps {
  id: string;
  name: string;
  onClick: (data: any) => void;
  content?: string | React.Component<any, any, any>;
  checked?: boolean;
  children: any;
}

export const CheckBox = (props: ICheckBoxProps) => {
  const { id, name, onClick, checked, children } = props;
  return (
    <>
      <input type="checkbox" id={id} name={name} onClick={onClick} checked={checked} />
      <label htmlFor="selectAll">{children}</label>
    </>
  );
};

CheckBox.defaultProps = {
  checked: false,
};
