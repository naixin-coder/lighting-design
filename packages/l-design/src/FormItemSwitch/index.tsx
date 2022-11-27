import type { SwitchProps } from 'antd';
import { Switch } from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import type { LFormItemProps } from '../FormItem/base/BaseFromItem';
import LFormItem from '../FormItem/base/BaseFromItem';

const SwitchWrapper = (
  props: Pick<LFormItemSwitchProps, 'checkedBg' | 'unCheckedBg' | 'switchProps'> &
    Record<string, any>,
) => {
  const { checked, onChange, unCheckedBg, checkedBg, ...switchProps } = props;
  const styles = useMemo(() => {
    return checked ? { backgroundColor: checkedBg } : { backgroundColor: unCheckedBg };
  }, [checkedBg, unCheckedBg, checked]);

  const handleChange = useCallback(
    (bool: boolean) => {
      if (switchProps?.onChange) {
        switchProps?.onChange(bool);
      }
      onChange(bool);
    },
    [onChange, switchProps],
  );

  return <Switch {...switchProps} style={styles} checked={checked} onChange={handleChange} />;
};

export interface LFormItemSwitchProps extends LFormItemProps {
  switchProps?: SwitchProps;
  checkedBg?: string;
  unCheckedBg?: string;
}

const LFormItemSwitch: FC<LFormItemSwitchProps> = ({
  checkedBg,
  unCheckedBg,
  switchProps = {},

  required,
  ...restProps
}) => {
  return (
    <LFormItem isSelectType valuePropName="checked" required={required} {...restProps}>
      <SwitchWrapper checkedBg={checkedBg} unCheckedBg={unCheckedBg} {...switchProps} />
    </LFormItem>
  );
};

export default LFormItemSwitch;
