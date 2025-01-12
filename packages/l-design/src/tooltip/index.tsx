/* eslint-disable react/jsx-key */
import type { CSSProperties, FC } from 'react';
import './index.less';

export interface LTooltipProps {
  /**
   * 气泡位置
   */
  placement:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  /**
   * 提示文字
   */
  title: string | React.ReactNode;
  /**
   *  tooltip最大宽度
   */
  maxWidth: number;
  /**
   * 样式
   */
  style: CSSProperties;
  /**
   * 类名
   */
  className: string;
  /**
   * 卡片类名
   */
  tipClassName: string;
  /**
   * 卡片样式
   */
  tipStyle: CSSProperties;
  /**
   * 背景颜色
   */
  color: string;
  /**
   * 设置 Tooltip 的 z-index
   */
  zIndex: number;
  /**
   *  文字显示行数
   */
  rows: number;
  /**
   * ReactNode
   */
  children: React.ReactNode;
}

const prefixCls = 'lightd-tooltip';

const LTooltip: FC<Partial<LTooltipProps>> = ({
  className,
  style,
  tipClassName,
  tipStyle,
  placement = 'top',
  title = '',
  color,
  rows = false,
  maxWidth = 400,
  zIndex = 9999,
  children,
}) => {
  return (
    <div className={`${prefixCls} ${className || ''}`} style={style}>
      <div className={`${prefixCls}-controller ${placement}`}>
        {children}
        <div
          className={`${prefixCls}-child ${tipClassName || ''}`}
          style={{ zIndex, background: color, maxWidth, ...tipStyle }}
        >
          <div className={`${prefixCls}-after`} style={{ borderTopColor: color }} />
          <span
            className={typeof rows === 'number' ? `${prefixCls}-title` : ''}
            style={{
              WebkitLineClamp: rows as number,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LTooltip;
