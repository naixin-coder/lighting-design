import type { ButtonProps, UploadProps } from 'antd';
import type { FC, ReactNode } from 'react';
import { useContext, useMemo } from 'react';
import { LFormContext } from '../../../Form/base/BaseForm';
import { getFormItemLabel } from '../../../utils';
import type { LFormItemProps } from '../../base/BaseFromItem';
import LFormItem from '../../base/BaseFromItem';
import UploadAvatar from './base/UploadAvatar';
import UploadDefault from './base/UploadDefault';
import UploadDragger from './base/UploadDragger';
import UploadImage from './base/UploadImage';
import type { UploadWrapperProps } from './base/UploadWrapper';

const normFile = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  return value?.fileList ?? [];
};

export type LFormItemUploadProps = LFormItemProps &
  Pick<
    UploadWrapperProps,
    | 'accept'
    | 'action'
    | 'onUpload'
    | 'disabled'
    | 'multiple'
    | 'fileTypeMessage'
    | 'fileSizeMessage'
    | 'maxSize'
    | 'maxCount'
    | 'onGetPreviewUrl'
    | 'previewModalProps'
    // | 'buttonProps'
  > & {
    uploadType?: 'image' | 'default' | 'avatar' | 'dragger';
    uploadProps?: UploadProps;
    buttonProps?: ButtonProps;
    buttonIcon?: ReactNode;
    buttonText?: string;
    /** 是否需要裁剪 */
    isCrop?: boolean;
    cropProps?: Record<string, any>;
    /** 是否是串行上传 为true为串行 为false为并行 */
    isSerial?: boolean;
  };

const LFormItemUpload: FC<LFormItemUploadProps> = ({
  uploadType = 'default',
  isCrop = false,
  isSerial = true,
  cropProps = {
    modalOk: '确定',
    modalCancel: '取消',
  },
  onUpload,
  fileTypeMessage,
  fileSizeMessage,
  buttonIcon,
  buttonText,
  buttonProps,
  onGetPreviewUrl,
  maxSize,
  maxCount,
  disabled,
  multiple = false,
  action,
  accept,
  uploadProps,
  placeholder,
  previewModalProps,
  name, // formItem 字段
  required,
  ...restProps
}) => {
  const UploadComp = useMemo(() => {
    if (uploadType === 'image') {
      return UploadImage;
    }
    if (uploadType === 'avatar') {
      return UploadAvatar;
    }
    if (uploadType === 'dragger') {
      return UploadDragger;
    }
    return UploadDefault;
  }, [uploadType]);
  const { disabled: formDisabled } = useContext(LFormContext);

  return (
    <LFormItem
      name={name}
      required={required}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={[
        {
          validator(rules, value) {
            let errMsg = '';
            if (!value || (Array.isArray(value) && value.length <= 0)) {
              errMsg = required ? `${placeholder || `请上传${getFormItemLabel(restProps)}`}!` : '';
            }
            if (errMsg) {
              return Promise.reject(errMsg);
            }
            return Promise.resolve();
          },
        },
      ]}
      {...restProps}
    >
      <UploadComp
        isSerial={isSerial}
        isCrop={isCrop}
        cropProps={cropProps}
        buttonIcon={buttonIcon}
        buttonText={buttonText}
        buttonProps={buttonProps}
        action={action}
        accept={accept}
        onUpload={onUpload}
        fileTypeMessage={fileTypeMessage}
        fileSizeMessage={fileSizeMessage}
        previewModalProps={previewModalProps}
        onGetPreviewUrl={onGetPreviewUrl}
        maxSize={maxSize}
        maxCount={maxCount}
        disabled={disabled ?? formDisabled}
        multiple={multiple}
        {...uploadProps}
      />
    </LFormItem>
  );
};

export default LFormItemUpload;
