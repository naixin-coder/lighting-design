import type { SpinProps } from 'antd';
import type { SegmentedLabeledOption, SegmentedValue } from 'antd/lib/segmented';
import type { FC } from 'react';
import type { LFormItemProps } from '../../base/BaseFromItem';
import LFormItem from '../../base/BaseFromItem';
import type { SegmentedWrapperProps } from './base/SegmentedWrapper';
import SegmentedWrapper from './base/SegmentedWrapper';

export interface LFormItemSegmentedoProps
  extends LFormItemProps,
    Pick<SegmentedWrapperProps, 'segmentedProps' | 'request'> {
  dependencies?: string[];
  debounceTime?: number;
  options?: (SegmentedValue | SegmentedLabeledOption)[];
  /**
   * @name 自定义loading效果 具体参考(https://ant-design.gitee.io/components/spin-cn/#API)
   */
  spin?: SpinProps;
}

const LFormItemSegmented: FC<LFormItemSegmentedoProps> = ({
  request,
  debounceTime,
  options = [],
  segmentedProps = {},
  spin,

  required,
  ...restProps
}) => {
  return (
    <LFormItem required={required} isSelectType {...restProps}>
      <SegmentedWrapper
        dependencies={restProps?.dependencies}
        options={options}
        request={request}
        outLoading={spin}
        debounceTime={debounceTime}
        // @ts-ignore
        segmentedProps={segmentedProps}
      />
    </LFormItem>
  );
};

export default LFormItemSegmented;
