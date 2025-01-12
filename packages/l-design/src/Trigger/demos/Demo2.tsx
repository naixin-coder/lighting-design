import { LForm, LFormItem, LFormItemInput, LTrigger } from 'lighting-design';
import ChildTable1 from './ChildTable1';
import ChildTable2 from './ChildTable2';

const Demo2 = () => {
  return (
    <LForm
      // labelCol={{ flex: '90px' }}
      name="LTrigger"
      labelWidth={90}
      submitter={{ buttonAlign: 90 }}
      transformValues={(values) => {
        const { trigger1, trigger2, ...restValues } = values;
        return {
          ...restValues,
          trigger1Id: trigger1?.value,
          trigger2Id: trigger2?.value,
        };
      }}
      onFinish={async (values) => {
        console.log('values', values);
      }}
    >
      <LFormItemInput name="input" label="输入框" />
      <LFormItem required name="trigger1" label="弹出表格1">
        <LTrigger>
          <ChildTable1 />
        </LTrigger>
      </LFormItem>
      <LFormItem required name="trigger2" label="弹出表格2">
        <LTrigger style={{ width: '100%' }}>
          <ChildTable2 />
        </LTrigger>
      </LFormItem>
    </LForm>
  );
};
export default Demo2;
