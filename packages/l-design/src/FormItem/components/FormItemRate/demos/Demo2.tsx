import { Form } from 'antd';
import { LForm, LFormItemRate } from 'lighting-design';

const Demo2 = () => {
  const [form] = Form.useForm();

  return (
    <LForm form={form} submitter={false}>
      <LFormItemRate
        name="rate1"
        initialValue={3.5}
        rateProps={{
          disabled: true,
          allowHalf: true,
        }}
      />
    </LForm>
  );
};
export default Demo2;
