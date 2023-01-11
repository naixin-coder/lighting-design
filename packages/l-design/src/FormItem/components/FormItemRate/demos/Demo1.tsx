import { Form } from 'antd';
import { LForm, LFormItemRate } from 'lighting-design';

const Demo1 = () => {
  const [form] = Form.useForm();

  return (
    <LForm
      name="LFormItemSelect"
      form={form}
      submitter={false}
      onValuesChange={(e) => {
        console.log(e);
      }}
    >
      <LFormItemRate
        label="评分"
        name="rate1"
        initialValue={3}
        required
      />
    </LForm>
  );
};
export default Demo1;
