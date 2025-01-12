import { LForm, LFormItemNumber } from 'lighting-design';
import renderFieldWithPopover from './renderFieldWithPopover';

const Demo = () => {
  const [form] = LForm.useForm();

  return (
    <LForm name="LFormItemNumber" form={form} submitter={{ buttonAlign: 'center' }}>
      <LFormItemNumber name="number1" label="金额1" required contentAfter={<div>$</div>} />

      <LFormItemNumber
        label="金额2"
        name="number2"
        numberProps={{
          prefix: '￥',
        }}
      />
      <LFormItemNumber
        label="数字"
        name="number3"
        max={1000}
        numberProps={{
          precision: undefined,
        }}
      />

      <LFormItemNumber
        name="number66"
        label="格式化数字1"
        numberProps={{
          precision: undefined,
          defaultValue: 1000,
          formatter: (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value) => value!.replace(/\$\s?|(,*)/g, ''),
        }}
      />
      <LFormItemNumber
        label="格式化数字2"
        name="number77"
        numberProps={{
          precision: undefined,
          defaultValue: 99,
          formatter: (value) => `${value}%`,
          parser: (value) => value!.replace('%', ','),
        }}
      />

      <LFormItemNumber
        label="自定义渲染"
        name="with-popover"
        tooltip="该方案可用于所有表单项"
        renderField={renderFieldWithPopover({ content: '该方案可用于所有表单项' })}
      />
    </LForm>
  );
};
export default Demo;
