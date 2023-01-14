import { useDeepCompareEffect, useRequest, useSafeState, useUpdateEffect } from 'ahooks';
import type { RadioChangeEvent, RadioGroupProps, SpinProps } from 'antd';
import { Radio, Spin } from 'antd';
import type { FC, ReactNode } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

export type RadioWrapperProps = Record<string, any> & {
  request?: (...args: any[]) => Promise<any>;
  debounceTime?: number;
  all?: boolean;
  allValue?: number | string;
  allLabel?: ReactNode;
  radioProps?: RadioGroupProps;
  dependencies?: string[];
  outLoading?: SpinProps;
};

const RadioWrapper: FC<RadioWrapperProps> = ({
  value,
  onChange,
  outLoading,
  dependencies = [],
  disabled,
  options: outOptions = [],
  request,
  debounceTime,
  all = false,
  allValue = '',
  allLabel = '全部',

  radioProps = {},

  ...restProps
}) => {
  const [optsRequest, setOptsRequest] = useState<{ label: ReactNode; value: string | number }[]>(
    [],
  );
  const [loading, setLoading] = useSafeState<boolean>(outLoading?.spinning || false);

  const isFirst = useRef<boolean>(true); // 组件是否第一次挂载
  const { run } = useRequest(request || (async () => []), {
    manual: true,
    debounceWait: debounceTime,
    defaultParams: [],
    onSuccess: (result) => {
      if (all && result?.length > 0) {
        setOptsRequest([{ label: allLabel, value: allValue }, ...result]);
      } else {
        setOptsRequest([...result]);
      }
    },
    onError: () => {
      setOptsRequest([]);
    },
  });

  const hasLoading = useMemo(
    (): boolean => Reflect.has(typeof outLoading === 'object' ? outLoading : {}, 'spinning'),
    [outLoading],
  );

  useUpdateEffect(() => {
    if (hasLoading) setLoading(outLoading?.spinning || false);
  }, [outLoading]);

  // 获取依赖项
  const depends = useMemo(
    () => dependencies?.map((nameStr) => restProps[nameStr]),
    [dependencies, restProps],
  );
  // 判断依赖项是否有空或undefined
  const isClearDepends = useMemo(
    () =>
      depends.some((nameValue) => nameValue === '' || nameValue == undefined || !nameValue?.length),
    [depends],
  );

  const opts = useMemo(() => {
    const rawOptions = radioProps.options || outOptions;
    if (all && rawOptions?.length > 0) {
      const retOptions = [{ label: allLabel, value: allValue }, ...rawOptions];
      return retOptions;
    }
    return rawOptions;
  }, [all, allLabel, allValue, outOptions, radioProps.options]);

  useDeepCompareEffect(() => {
    if (!request) return;
    // 组件第一次加载时调用request
    if (isFirst.current) {
      isFirst.current = false;
      (async () => {
        try {
          if (!hasLoading) setLoading(true);
          const newOptions = await request(...depends);
          if (all && newOptions?.length > 0) {
            setOptsRequest([{ label: allLabel, value: allValue }, ...newOptions]);
          } else {
            setOptsRequest([...newOptions]);
          }
        } catch (error) {
          setOptsRequest([]);
        }
        if (!hasLoading) setLoading(false);
      })();
    } else {
      // 防抖调用
      run(...depends);
    }
  }, [restProps, allLabel, allValue, all]);

  // 依赖清除
  useDeepCompareEffect(() => {
    if (isClearDepends && value != undefined) {
      onChange(undefined);
    }
  }, [value, isClearDepends]);

  const radioOptions = useMemo(() => {
    if (optsRequest?.length > 0) {
      return optsRequest;
    } else if (opts.length > 0) {
      return opts;
    } else {
      return [];
    }
  }, [opts, optsRequest]);

  const handleChange = useCallback(
    (val: RadioChangeEvent) => {
      if (radioProps?.onChange) {
        radioProps?.onChange(val);
      }
      onChange(val);
    },
    [onChange, radioProps],
  );

  return (
    <Spin spinning={loading} style={{ marginLeft: 32, width: 'fit-content' }} {...outLoading}>
      <Radio.Group
        options={radioOptions}
        disabled={disabled ?? isClearDepends}
        {...radioProps}
        value={value}
        onChange={handleChange}
      />
    </Spin>
  );
};

export default RadioWrapper;
