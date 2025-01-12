import { Button, message } from 'antd';
import { LForm, LFormItemInput, LFormItemRadio, LModalForm } from 'lighting-design';
import { awaitTime } from '../../../../_utils';

const Demo1 = () => {
  const [form] = LForm.useForm();

  return (
    <>
      <LModalForm
        isDraggable
        form={form}
        title="弹窗"
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
          await awaitTime();
          message.success('提交成功');
          return true;
        }}
        trigger={<Button type="primary">打开弹窗</Button>}
      >
        <LFormItemInput name="input" required label="输入框" />
        <LFormItemRadio
          label="单选2"
          name="LFormItemRadio2"
          all
          required
          request={async () => {
            const result = await awaitTime(
              [
                { label: 'Unresolved', value: 'open' },
                { label: 'Resolved', value: 'closed' },
                { label: 'Resolving', value: 'processing' },
              ],
              1000,
            );
            if (result.success) return result.data;
          }}
        />
      </LModalForm>
    </>
  );
};

export default Demo1;
