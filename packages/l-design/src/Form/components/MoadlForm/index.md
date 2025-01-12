---
title: LMoadlForm
order: 2
nav:
  order: 2
  path: /components
---

# LMoadlForm

基于 LForm 扩展的弹窗表单。

## 代码演示

### 可拖动的弹窗

<code src='./demos/Demo1.tsx'>

### 使用 open 受控方式

<code src='./demos/Demo3.tsx'>

### 自定义底部按钮

<code src='./demos/Demo2.tsx'>

### 关闭弹窗时不重置到初始值

<code src='./demos/Demo4.tsx'>

## API

```ts
import { LModalForm } from 'lighting-design';
```

除了以下参数，其余和 [LForm](/components/form#api) 一样。

<mark>`LMoadlForm` 的`底部操作栏`通过 `LForm` 的`submitter`属性配置</mark>

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isDraggable | `Modal`能否拖动 | `boolean` | `false` |
| isResetFields | 是否在关闭弹窗时重置表单到初始值 | `boolean` | `true` |
| forceRender | 是否预渲染`LMoadlForm`的内容 | `boolean` | `false` |
| title | `Modal` 标题 | `ReactNode` | `-` |
| width | `Modal` 宽度 | `number \| string` | `600` |
| trigger | 用于触发 `Modal` 打开的 dom，一般是 Button 组件 | `ReactElement` | `-` |
| open | 是否打开。<br/>设置后表示为 `受控组件`，可结合 `onOpenChange` 进行控制。 | `boolean` | `-` |
| onOpenChange | `open` 改变时触发 | `(open: boolean) => void` | `- ` |
| modalProps | `Modal` 的 `props`，使用方式与 antd 相同。 | [ModalProps](https://ant.design/components/modal-cn/#API) | `-` |
| onFinish | 提交数据时触发。如果返回 `true` 或 `Promise.resolve(true)` 表示提交成功，会关闭弹框并且会自动管理`loading` | `async (values: any) => any` | `-` |
