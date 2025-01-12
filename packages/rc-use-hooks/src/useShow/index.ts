import _cloneDeep from 'lodash/cloneDeep';
import type { RefObject } from 'react';
import { useCallback, useImperativeHandle, useRef } from 'react';

export declare type UseShowInstance<T = any> = {
  onShow: (record: T) => void;
  onHide: (data?: any) => void;
  getChildData: () => any;
};

export declare type UseShowInstanceRef<T = any> = RefObject<UseShowInstance<T>>;

export declare type UseShowOptions<T> = {
  /** show触发事件 */
  onShow: (data: T) => void;
  /** 格式化data */
  onFormart?: (data: T) => T;
  /** hide触发事件 */
  onHide?: (data?: any) => void;
};

export declare type UseShowResult = {
  parentData: Record<string, any>;
  setParentData: <T = any>(data: T) => void;
};

/**
 * 父调用子组件方法，并传值更新状态
 * @param funcRef ref对象
 * @param options { onShow, onFormart, onHide }
 * @returns T 传输的数据
 */
export default function useShow(
  funcRef: UseShowInstanceRef,
  options: UseShowOptions<Record<string, any>>,
): UseShowResult {
  const ref = useRef<null | any>(null);
  const childrenDataRef = useRef<null | any>(null);
  const opsOnShow = options.onShow,
    opsOnFormart = options.onFormart,
    opsOnHide = options.onHide;

  const onCallback = useCallback(<T = any>(data: T) => {
    childrenDataRef.current = data;
  }, []);

  useImperativeHandle(funcRef, () => {
    return {
      onShow: function (data) {
        ref.current = _cloneDeep(data);
        if (opsOnShow) opsOnShow(ref.current);
      },

      onHide: function (data) {
        if (opsOnHide) opsOnHide(_cloneDeep(data));
      },

      getChildData: function () {
        // 传给父组件的数据
        return childrenDataRef.current;
      },
    };
  });

  return {
    parentData: opsOnFormart ? opsOnFormart(ref.current) : ref.current,
    setParentData: onCallback,
  };
}
