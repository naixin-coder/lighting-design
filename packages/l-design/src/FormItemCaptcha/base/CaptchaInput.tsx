import { useMount } from 'ahooks';
import type { InputProps, InputRef } from 'antd';
import { Divider, Input } from 'antd';
import * as React from 'react';
import type { LCaptchaButtonProps } from '../../CaptchaButton';
import LCaptchaButton from '../../CaptchaButton';

export interface CodeInputProps extends Record<number | string, any> {
  value?: any;
  onChange?: (value: any) => void;
  type?: 'default' | 'inline'; // 显示类型
  inputProps?: InputProps;
  buttonProps?: LCaptchaButtonProps;
  autoClick?: boolean;
  autoFocusOnGetCaptcha?: true;
  // 发送验证码
  onGetCaptcha?: () => boolean | Promise<any>;
}

const checkResult = async (fn: () => boolean | Promise<boolean>) => {
  try {
    const ret = await fn();
    if (ret !== false) {
      return ret;
    }
  } catch (error) {
    console.error('checkResult ', error);
  }
  return Promise.reject(false);
};

const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,

  type = 'default',
  onGetCaptcha = () => true,
  autoClick = false,
  autoFocusOnGetCaptcha = true,
  inputProps = {},
  buttonProps = {},

  ...restProps
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { onClick, onEnd } = buttonProps;
  // 点击按钮
  const onButtonClick = React.useCallback(
    async (e: React.MouseEvent<HTMLElement>) => {
      console.log('点击按钮 ');
      onClick?.(e);
      // 用于验证手机号码或邮箱，并请求获取验证码。如果返回 false 或 Promise.reject() 表示验证失败或请求验证码失败。
      await checkResult(onGetCaptcha);
      if (autoFocusOnGetCaptcha) {
        inputRef.current!.focus();
      }
    },
    [autoFocusOnGetCaptcha, onClick, onGetCaptcha],
  );

  const handleEnd = React.useCallback(() => {
    onEnd?.();
  }, [onEnd]);

  // @ts-ignore
  React.useImperativeHandle(buttonProps?.ref, () => buttonRef.current, [buttonRef]);

  const defaultStyle = React.useMemo(() => {
    let inputStyle: React.CSSProperties = {
      flex: 1,
      transition: 'width 0.3s ease 0s',
      marginRight: '8px',
    };
    let buttonStyle: React.CSSProperties = {};
    if (type === 'inline') {
      inputStyle = { flex: 1 };
      buttonStyle = {
        height: 'auto',
        padding: '0 4px 0 6px',
      };
    }
    return {
      input: inputStyle,
      button: buttonStyle,
    };
  }, [type]);

  const buttonStyle = React.useMemo(
    () => ({
      ...defaultStyle.button,
      ...buttonProps?.style,
    }),
    [buttonProps?.style, defaultStyle.button],
  );

  const captchaButtonDom = (
    <LCaptchaButton
      type={type === 'inline' ? 'link' : 'default'}
      {...buttonProps}
      onClick={onButtonClick}
      onEnd={handleEnd}
      ref={buttonRef as unknown as React.RefObject<React.RefObject<HTMLInputElement>>}
      style={buttonStyle}
    />
  );

  useMount(() => {
    if (autoClick) {
      buttonRef.current!.click();
    }
  });

  return (
    <div style={{ display: 'flex' }}>
      <Input
        placeholder="请输入"
        onChange={onChange}
        value={value}
        allowClear
        autoComplete="off"
        ref={inputRef as unknown as React.Ref<InputRef> | undefined}
        {...restProps}
        {...inputProps}
        style={{
          ...defaultStyle.input,
          ...inputProps?.style,
        }}
        suffix={
          type === 'inline' ? (
            <>
              {inputProps?.suffix}
              <Divider type="vertical" />
              {captchaButtonDom}
            </>
          ) : (
            inputProps?.suffix
          )
        }
      />
      {type !== 'inline' ? captchaButtonDom : null}
    </div>
  );
};

export default CodeInput;
