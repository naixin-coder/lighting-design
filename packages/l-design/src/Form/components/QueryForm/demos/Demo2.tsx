import { Form } from 'antd';
import { LFormItemInput, LQueryForm } from 'lighting-design';

const Demo1 = () => {
  const [form] = Form.useForm();

  return (
    <>
      <LQueryForm
        isSpace
        name="query-form-2"
        form={form}
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
        }}
      >
        <LFormItemInput name="input1" required label="输入框1" />
        <LFormItemInput name="input2" required label="输入框2" />
        <LFormItemInput name="input3" required label="输入框3" />
        <LFormItemInput name="input4" required label="输入框4" />
      </LQueryForm>
    </>
  );
};

export default Demo1;
