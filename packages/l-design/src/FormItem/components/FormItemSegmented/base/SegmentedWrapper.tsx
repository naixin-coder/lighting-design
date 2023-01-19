import { useDeepCompareEffect, useRequest, useSafeState, useUpdateEffect } from 'ahooks';
import type { SegmentedProps, SpinProps } from 'antd';
import { Segmented, Spin } from 'antd';
import type { SegmentedLabeledOption, SegmentedValue } from 'antd/lib/segmented';
import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

export type SegmentedWrapperProps = Record<string, any> & {
  request?: (...args: any[]) => Promise<any>;
  debounceTime?: number;
  options?: SegmentedProps['options'];
  segmentedProps?:
    | SegmentedProps
    | { onChange?: (value: SegmentedValue) => void; options?: SegmentedProps['options'] };
  dependencies?: string[];
  outLoading?: SpinProps;
};

const SegmentedWrapper: FC<SegmentedWrapperProps> = ({
  value,
  onChange,
  dependencies = [],
  options: outOptions = [],
  request,
  outLoading,
  disabled,
  debounceTime,
  segmentedProps = {},

  ...restProps
}) => {
  const [optsRequest, setOptsRequest] = useState<(SegmentedValue | SegmentedLabeledOption)[]>([]);
  const [loading, setLoading] = useSafeState<boolean>(outLoading?.spinning || false);

  const hasLoading = useMemo(
    (): boolean => Reflect.has(typeof outLoading === 'object' ? outLoading : {}, 'spinning'),
    [outLoading],
  );
  const isFirst = useRef<boolean>(true); // 组件是否第一次挂载
  const { run } = useRequest(request || (async () => []), {
    manual: true,
    debounceWait: debounceTime,
    onSuccess: (result) => {
      if (!hasLoading) setLoading(false);
      setOptsRequest([...result]);
    },
    onError: () => {
      if (!hasLoading) setLoading(false);
      setOptsRequest([]);
    },
  });

  useUpdateEffect(() => {
    if (hasLoading) setLoading(outLoading?.spinning || false);
  }, [outLoading]);

  // 获取依赖项的值
  const dependValues = useMemo(
    () => dependencies?.map((nameStr) => restProps[nameStr]),
    [dependencies, restProps],
  );

  // 判断依赖项的值是否有空或undefined
  const isClearDepends = useMemo(
    () =>
      dependValues.some(
        (nameValue) => nameValue === '' || nameValue == undefined || !nameValue?.length,
      ),
    [dependValues],
  );

  const opts = useMemo(() => {
    const rawOptions = segmentedProps?.options || outOptions;
    return rawOptions;
  }, [outOptions, segmentedProps?.options]);

  useDeepCompareEffect(() => {
    if (!request) return;
    // 组件第一次加载时调用request
    if (isFirst.current) {
      isFirst.current = false;
      if (isClearDepends) return;
      (async () => {
        try {
          if (!hasLoading) setLoading(true);
          const newOptions = await request(...dependValues);
          setOptsRequest(newOptions);
        } catch (error) {
          setOptsRequest([]);
        }
        if (!hasLoading) setLoading(false);
      })();
    } else {
      if (!isClearDepends) {
        if (!hasLoading) setLoading(true);
        // 防抖调用
        run(...dependValues);
      }
    }
  }, [dependValues]);

  // 依赖清除
  useDeepCompareEffect(() => {
    if (isClearDepends && value != undefined) {
      onChange(undefined);
    }
  }, [value, isClearDepends]);

  const segmentedOptions = useMemo(() => {
    if (isClearDepends) {
      return [];
    } else if (optsRequest?.length > 0) {
      return optsRequest;
    } else if (opts.length > 0) {
      return opts;
    } else {
      return [];
    }
  }, [isClearDepends, opts, optsRequest]);

  const handleChange = useCallback(
    (val: SegmentedValue) => {
      if (segmentedProps?.onChange) {
        segmentedProps?.onChange(val);
      }
      onChange(val);
    },
    [onChange, segmentedProps],
  );

  return (
    <Spin spinning={loading} style={{ marginLeft: 40, width: 'fit-content' }} {...outLoading}>
      {/* @ts-ignore */}
      <Segmented
        disabled={disabled ?? isClearDepends}
        {...segmentedProps}
        options={segmentedOptions}
        value={value}
        onChange={handleChange}
      />
    </Spin>
  );
};

export default SegmentedWrapper;
