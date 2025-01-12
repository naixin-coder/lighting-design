import type { SetStateAction } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isFunction } from '../utils';

/**
 * useState的回调 setState第二个参数(函数)获取最新的state并执行一些操作
 * @export
 * @template T
 * @param {T} state
 * @return {*}  { [T,  (val: SetStateAction<T>, cb: (newVal: T) => void) => void}
 */
export default function useCallbackState<T>(
  state: T,
): [T, (val: SetStateAction<T>, cb: (newVal: T) => void) => void] {
  const callBackRef = useRef<Function>();
  const [data, setData] = useState<T>(state);
  useEffect(() => {
    callBackRef?.current?.(data);
  }, [data]);

  const setState = useCallback((newState: SetStateAction<T>, cb?: (val: T) => void) => {
    if (isFunction(cb)) {
      callBackRef.current = cb;
    }
    setData((prevState: T) => {
      const ret = isFunction(newState) ? (newState as Function)?.(prevState) : newState;
      return ret;
    });
  }, []);

  return [data, setState];
}
