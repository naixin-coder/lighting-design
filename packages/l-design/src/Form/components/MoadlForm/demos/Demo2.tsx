import { Button, message, Space } from 'antd';
import { LForm, LFormItemInput, LModalForm } from 'lighting-design';
import { awaitTime } from '../../../../_utils';

const Demo1 = () => {
  const [form1] = LForm.useForm();
  const [form2] = LForm.useForm();
  const [form3] = LForm.useForm();
  const [form4] = LForm.useForm();

  return (
    <Space>
      <LModalForm
        name="LModalForm1"
        form={form1}
        title="新增"
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
          await awaitTime();
          message.success('提交成功');
          return true;
        }}
        submitter={{
          render(dom) {
            return (
              <>
                <Button onClick={() => form1.setFieldsValue({ name: null })}>重置</Button>
                {dom}
              </>
            );
          },
        }}
        trigger={<Button type="primary">自定义按钮1</Button>}
      >
        <LFormItemInput name="name" required label="姓名" />
      </LModalForm>
      <LModalForm
        name="LModalForm2"
        form={form2}
        title="新增"
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
          await awaitTime();
          message.success('提交成功');
          return true;
        }}
        submitter={{
          buttonAlign: 'center',
          submitText: '提交',
        }}
        trigger={<Button type="primary">自定义按钮2</Button>}
      >
        <LFormItemInput name="name" required label="姓名" />
      </LModalForm>
      <LModalForm
        name="LModalForm3"
        form={form3}
        title="新增"
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
          await awaitTime();
          message.success('提交成功');
          return true;
        }}
        submitter={{
          showReset: false,
          submitText: '提交',
        }}
        trigger={<Button type="primary">自定义按钮3</Button>}
      >
        <LFormItemInput name="name" required label="姓名" />
      </LModalForm>
      <LModalForm
        name="LModalForm4"
        form={form4}
        title="新增"
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
          await awaitTime();
          message.success('提交成功');
          return true;
        }}
        submitter={{
          buttonAlign: 'left',
          render(dom) {
            return (
              <>
                {dom}
                <Button>其他</Button>
              </>
            );
          },
        }}
        trigger={<Button type="primary">自定义按钮4</Button>}
      >
        <LFormItemInput name="name" required label="姓名" />
      </LModalForm>
    </Space>
  );
};

export default Demo1;
