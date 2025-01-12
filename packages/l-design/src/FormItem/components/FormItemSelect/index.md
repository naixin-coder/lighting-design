---
title: LFormItemSelect
order: 2
nav:
  order: 2
  path: /components
---

# LFormItemSelect

下拉选择器

**特点**

- 支持请求数据获得 `options`
- 支持依赖项变化自动重新请求
- 支持请求防抖
- `request` 的参数为依赖项的值
- 支持配置`全部`选项

## 代码演示

### 基础用法

<code src='./demos/Demo1.tsx'>

### 异步请求

<code src='./demos/Demo2.tsx'>

### 依赖项发生变化自动请求

<code src='./demos/Demo3.tsx'>

## API

```ts
import { LFormItemSelect } from 'lighting-design';
```

<mark>`depends` 为 LFormItem 组件 `dependencies` 属性依赖项的值 , 如果依赖项发生变化则会自动请求数据 , 如果依赖项的值为`假值或者空数组`则本身数据也会清除或者禁用选择<mark/>

除了以下参数，其余和 [LFormItem](/components/form-item) 一样。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 数据化配置选项内容 同`antd Select 的 options` | `LSelectOptions[]` | `[]` |
| request | 异步请求数据函数 | `(...depends: any[]) => Promise<LSelectOptions[]>` | `-` |
| debounceTime | 当依赖项发生变化时重新请求的防抖时间 | `number` | `-` |
| all | 是否需要全部选项 | `boolean ` | `false` |
| allLabel | 全部选项的名称 | `string ` | `全部` |
| allValue | 全部选项的值 | `string` | `''` |
| spin | 配置`request`时自定义`loading`效果 | [SpinProps](https://4x.ant.design/components/spin-cn/#API) | `-` |
| selectProps | `antd`选择器组件 Props | [SelectProps](https://4x.ant.design/components/select-cn/#API) | `-` |

### LSelectOptions

```ts
export interface LSelectOptions {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}
```
