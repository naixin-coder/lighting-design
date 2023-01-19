import { LForm, LFormItemUpload } from 'lighting-design';
import { upload } from './services';

const Demo1 = () => {
  const [form] = LForm.useForm();

  return (
    <LForm
      name="LFormItemUpload"
      form={form}
      onFinish={(values) => {
        console.log('values', values);
      }}
    >
      <LFormItemUpload
        name="default"
        label="默认上传"
        accept=".jpg, .jpeg"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // initialValue={[
        //   {
        //     name: 'meinv',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        // ]}
        // required
        // rules={[
        //   {
        //     validator(rules, value) {
        //       console.log('value ', value);
        //       let errMsg = '';
        //       if (!value || (Array.isArray(value) && value.length <= 0)) {
        //         errMsg = '请上传';
        //       }
        //       if (errMsg) {
        //         return Promise.reject(errMsg);
        //       }
        //       return Promise.resolve();
        //     },
        //   },
        // ]}
      />

      <LFormItemUpload
        required
        onUpload={upload}
        uploadType="avatar"
        name="avatar"
        label="头像上传"
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // initialValue={[
        //   {
        //     name: 'meinv',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        //   },
        // ]}
      />

      <LFormItemUpload
        name="image"
        label="图片上传"
        required
        uploadType="image"
        onUpload={upload}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        initialValue={[
          {
            name: 'meinv',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
        ]}
      />

      <LFormItemUpload
        // required
        uploadType="dragger"
        name="dragger"
        label="拖动上传"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      />
    </LForm>
  );
};
export default Demo1;
