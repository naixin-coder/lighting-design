---
title: LFormItemInput
order: 2
nav:
  order: 2
  path: /components
---

# LFormItemInput

输入框

**特点**

- 可配置过滤空格
  - 失焦校验
  - 自动过滤空格
  - `phone` 类型只能输入数字 11 位手机号
  - `idCard`类型 18 数字位最后一位可大小写 `x`
  - `bankCard`类型只能输入数字

## 代码演示

### 基础用法

<code src='./demos/Demo1.tsx'>

## API

```ts
import { LFormItemInput } from 'lighting-design';
```

除了以下参数，其余和 [LFormItem](/components/form-item#api) 一样。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| inputProps | `Input`的属性 | [InputProps](https://4x.ant.design/components/input-cn/#API) | `-` |
| disabledWhiteSpace | 是否禁用输入空格 | `boolean` | `true` |
| type | `内置输入框类型` | `InputProps['type'] \| 'bankCard' \| 'idCard' \| 'phone'` | `text` |