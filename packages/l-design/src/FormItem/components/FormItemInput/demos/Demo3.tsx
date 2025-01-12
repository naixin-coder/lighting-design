import { LForm, LFormItemPassword } from 'lighting-design';
import renderFieldWithPopover from './renderFieldWithPopover';

const Demo3 = () => {
  const [form] = LForm.useForm();

  return (
    <LForm name="LFormItemPassword" form={form} submitter={{ buttonAlign: 'center' }}>
      <LFormItemPassword className="myLFormItemInput" name="password1" label="密码1" required />
      <LFormItemPassword name="password2" label="密码2" required min={6} />

      <LFormItemPassword
        label="自定义渲染"
        name="with-popover"
        tooltip="该方案可用于所有表单项"
        renderField={renderFieldWithPopover({ content: '该方案可用于所有表单项' })}
      />
    </LForm>
  );
};
export default Demo3;
