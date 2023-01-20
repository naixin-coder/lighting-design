import { LoadingOutlined } from '@ant-design/icons';
import { Form } from 'antd';
import { LForm, LFormItemCascader, LFormItemSelect } from 'lighting-design';
import { awaitTime } from '../../../../_utils';

const Index = () => {
  const [form] = Form.useForm();

  return (
    <LForm
      name="LFormItemSelect3"
      form={form}
      labelCol={{ flex: '80px' }}
      submitter={{
        buttonAlign: 80,
      }}
    >
      <LFormItemSelect
        label="select1"
        name="select1"
        required
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
        ]}
      />
      <LFormItemCascader
        debounceTime={300}
        dependencies={['select1']}
        label="select2"
        name="select2"
        required
        spin={{
          indicator: <LoadingOutlined style={{ fontSize: 24 }} spin />,
        }}
        request={async (select1) => {
          console.log('select1 ', select1);
          // if (!select1) {
          //   return [];
          // }
          let data: Record<string, any>[] = [];
          if (select1 === 'a') {
            data = [{ label: 'A', value: 'a' }];
          }
          if (select1 === 'b') {
            data = [{ label: 'B', value: 'b' }];
          }
          if (select1 === 'c') {
            data = [{ label: 'C', value: 'c' }];
          }
          const result = await awaitTime(data);
          if (result.success) return result.data;
        }}
      />
    </LForm>
  );
};
export default Index;
