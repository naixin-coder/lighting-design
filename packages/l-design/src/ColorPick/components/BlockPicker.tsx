import type { FC } from 'react';
import type { BlockPickerProps } from 'react-color';
import { BlockPicker } from 'react-color';
import type { PickerCommonProps } from '../base/PickerWrapper';
import PickerWrapper from '../base/PickerWrapper';

export type ColorBlockPickerProps = Omit<BlockPickerProps, 'onChange' | 'onChangeComplete'> &
  PickerCommonProps;

const ColorBlockPicker: FC<ColorBlockPickerProps> = ({
  className,
  value,
  trigger,
  showText,
  onChange,
  colorMode,
  placement,
  changeMethod,
  size,
  disabled,
  ...restProps
}) => {
  const wrapperProps = {
    className,
    value,
    trigger,
    showText,
    onChange,
    colorMode,
    placement,
    changeMethod,
    size,
    disabled,
  };

  return (
    <PickerWrapper {...wrapperProps}>
      <BlockPicker {...restProps} triangle="hide" />
    </PickerWrapper>
  );
};

export default ColorBlockPicker;
