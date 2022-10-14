import { Button } from 'antd';
import type { FC } from 'react';
import './index.less';
import type { ButtonProps } from './type.d';
// import 'antd/es/button/style';

/**
 * Button
 * @param {*} { loading, children, icon, style, ...props }
 * @return {*}
 */
const LButton: FC<ButtonProps> = (props) => {
  // @ts-ignore
  return <Button {...props}>{props.children}</Button>;
};

export default LButton;
export type { ButtonProps };
