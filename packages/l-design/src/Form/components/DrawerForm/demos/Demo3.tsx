import { Button, message } from 'antd';
import { LDrawerForm, LForm, LFormItemInput } from 'lighting-design';
import { useEffect, useState } from 'react';
import { awaitTime } from '../../../../_utils';

const Demo3 = () => {
  const [form] = LForm.useForm();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ name: '法外狂徒' });
    }
  }, [form, open]);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        编辑
      </Button>

      <LDrawerForm
        open={open}
        onOpenChange={setOpen}
        form={form}
        title="编辑"
        onFinish={async (values) => {
          console.log('onFinish-values ', values);
          await awaitTime();
          message.success('提交成功');
          return true;
        }}
      >
        <LFormItemInput name="name" required label="姓名" />
      </LDrawerForm>
    </>
  );
};

export default Demo3;
