import React, { useState, useEffect } from "react";
import Switch from "react-switch";

interface UISwitchProps {
  onChange?: (checked: boolean) => void;
  checked: boolean;

  [key: string]: any;
}

const UISwitch = ({ onChange, checked, ...rest }: UISwitchProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked || false);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    if (onChange) {
      onChange(checked);
    }
  };

  return (
    <Switch
      onChange={handleChange}
      checked={isChecked}
      offColor="#ff0000"
      {...rest}
    />
  );
};

export default UISwitch;
