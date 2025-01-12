import { useControllableValue, useMemoizedFn, useSafeState, useUpdate } from 'ahooks';
import type { FormInstance, StepProps, StepsProps } from 'antd';
import { Form, Steps } from 'antd';
import { default as classnames, default as classNames } from 'classnames';
import type { FC, MutableRefObject, ReactElement, ReactNode } from 'react';
import { Children, cloneElement, useImperativeHandle, useRef } from 'react';
import type { BaseFormProps } from '../../../base/BaseForm';
import StepForm from './StepForm';
import StepsFormContext from './StepsFormContext';
import type { LStepsFormSubmitterProps } from './StepsSubmitter';
import StepsSubmitter from './StepsSubmitter';
import './styles.less';

export type LStepsFormActionRef = {
  /** 表单实例数组 */
  formInstanceList: FormInstance<any>[];
  /** 到指定步骤 */
  toStep: (num: number) => void;
  /** 上一步 */
  prev: () => void;
  /** 下一步 */
  next: (submitted?: boolean) => void;
  /** 提交 */
  submit: (isFinallySubmit?: boolean) => void;
  /** 重置 */
  reset: () => void;
};

export type LStepsFormProps = {
  /** 组件最外层容器类名 */
  className?: string;
  /** 表单外层容器的类名 */
  contentClassName?: string;
  /** 默认步骤 */
  defaultCurrent?: number;
  /** 是否将onFinish的得到的所有form数据合并 */
  isMergeValues?: boolean;
  /** 是否提交完成后需要重置 */
  isResetFields?: boolean;
  /** 是否准备好 */
  isReady?: boolean;
  /** 实例包含一些方法和属性 */
  actionRef?: MutableRefObject<LStepsFormActionRef | undefined>;
  /** 在哪一步为最后的提交操作,用于触发onFinish 默认为表单最后一步 */
  submitStepNum?: number;
  /** 默认表单最后一步提交成功触发，如果返回true就会自动重置表单(包括StepForm变回第一步) */
  onFinish?: (valuse: Record<string, any>) => Promise<void | boolean>;
  /** 上一步下一步提交按钮的配置 */
  submitter?: LStepsFormSubmitterProps | false;
  /** antd Steps 组件的属性  */
  stepsProps?: StepsProps;
  /** LForm的属性 */
  formProps?: Omit<BaseFormProps, 'title' | 'onReset' | 'contentRender' | 'submitter' | 'isReady'>;
  /** 重新渲染整个组件 */
  stepsFormRender?: (stepsDom: ReactNode, formDom: ReactNode, submitterDom: ReactNode) => ReactNode;
  /** 重新渲染表单组件 */
  stepFormRender?: (dom: ReactNode, index: number) => ReactNode;
  /** 重新渲染步骤组件 */
  stepsRender?: (dom: ReactNode, items: StepProps[]) => ReactNode;
  children: ReactElement[];
};

const prefixCls = 'lightd-form-steps';

const StepsForm: FC<LStepsFormProps> & {
  StepForm: typeof StepForm;
} = (props) => {
  const {
    className,
    contentClassName,
    isMergeValues = true,
    isResetFields = true,
    isReady = true,
    defaultCurrent = 0,
    actionRef,
    onFinish,
    stepsProps = {},
    submitter = {},
    formProps = {},
    stepsRender,
    stepFormRender,
    stepsFormRender,
    children,
  } = props;

  let { submitStepNum } = props;

  const stepsConfigRef = useRef<StepProps[]>([]); // 步骤条配置
  const formSubmitterRef = useRef<any[]>([]); // 操作配置
  const formInstanceListRef = useRef<FormInstance[]>([]); // 每个步骤的form实例
  const formInitialValues = useRef<Record<string, any>[]>([]); // 全部表单初始数据
  const formDataRef = useRef({}); // 全部表单最终数据
  const [loading, setLoading] = useSafeState(false);

  // 手动触发更新
  const update = useUpdate();
  const forgetUpdate = () => {
    // 延迟到最后更新
    update();
  };

  // 当前步骤
  const [stepNum, setStepNum] = useControllableValue(props, {
    defaultValue: defaultCurrent,
    defaultValuePropName: 'defaultCurrent',
    valuePropName: 'current',
    trigger: 'onCurrentChange',
  });

  // 遍历子组件提取配置
  const childs = Children.toArray(children);
  // 配置最终提交在哪一步触发
  if (typeof submitStepNum !== 'number' || submitStepNum < 0) {
    submitStepNum = childs.length;
  }
  childs.forEach((childItem, index) => {
    const {
      title,
      subTitle,
      icon,
      description,
      stepItemProps,
      submitter: childSubmitter,
    } = (childItem as ReactElement).props;

    // 配置Steps组件的item属性
    stepsConfigRef.current[index] = {
      key: `${index}`,
      title,
      subTitle,
      icon,
      description,
      ...stepItemProps,
    };

    // 获取每个表单组件的submitter属性并合并
    if (childSubmitter === false || childSubmitter === null || submitter === false) {
      formSubmitterRef.current[index] = false;
    } else if (typeof childSubmitter === 'object') {
      formSubmitterRef.current[index] = submitter
        ? { ...submitter, ...childSubmitter }
        : childSubmitter;
    } else {
      formSubmitterRef.current[index] = submitter;
    }
  });

  // 下一步
  const next = () => {
    if (stepNum < childs.length - 1) {
      const curStep = stepNum + 1;
      setStepNum(curStep);
    }
  };
  // 上一步
  const prev = () => {
    if (stepNum > 0) {
      const curStep = stepNum - 1;
      setStepNum(curStep);
    }
  };

  // 指定跳到哪一步
  const toStep = (num: number) => {
    if (num >= defaultCurrent && num <= childs.length - 1) {
      setStepNum(num);
    }
  };

  // 重置
  const reset = useMemoizedFn(() => {
    setStepNum(defaultCurrent);
    formDataRef.current = {};
    formInstanceListRef.current.forEach((item, i) => {
      // item?.resetFields();
      item?.setFieldsValue({
        ...formInitialValues.current[i],
      });
    });
  });

  // 提交
  const submit = useMemoizedFn(async () => {
    if (typeof onFinish === 'function') {
      let values;
      if (isMergeValues) {
        // 合并每个表单的值
        values = Object.values<typeof formDataRef.current>(formDataRef.current).reduce(
          (pre, cur) => ({ ...pre, ...cur }),
          {},
        );
      } else {
        values = formDataRef.current;
      }
      const ret = onFinish(values);
      if (ret instanceof Promise) {
        setLoading(true);
        try {
          const res = await ret;
          if (res === true && isResetFields) {
            reset(); // 如果返回true就会自动重置表单(包括StepForm变回第一步)
          }
        } catch (err) {
          console.error(err); // eslint-disable-line
        } finally {
          setLoading(false);
        }
      }
    }
  });

  // 每个表单下一步/提交时触发,用于记录当前表单值
  const onFormFinish = (name: string, values: Record<string, any>) => {
    formDataRef.current[name] = values;
  };

  // 暴露方法和属性
  useImperativeHandle(actionRef, () => ({
    allFormValues: formDataRef.current,
    formInstanceList: formInstanceListRef.current,
    toStep,
    prev: () => {
      if (!isReady) return;
      prev();
      const currentSubmitter = formSubmitterRef.current[stepNum];
      currentSubmitter?.onPrev();
    },
    // submitted是否触发当前表单提交验证
    next: (submitted = false) => {
      if (!isReady) return;
      if (submitted) {
        formInstanceListRef.current[stepNum].submit();
      } else {
        next();
      }
      const currentSubmitter = formSubmitterRef.current[stepNum];
      currentSubmitter?.onNext?.();
    },
    // 是否在最后一步触发提交
    submit: (isFinallySubmit = true) => {
      if (!isReady) return;
      if (!isFinallySubmit) {
        formInstanceListRef.current[stepNum].submit();
      } else {
        submit();
      }
      const currentSubmitter = formSubmitterRef.current[stepNum];
      currentSubmitter?.onSubmit?.();
    },
    reset: () => {
      if (!isReady) return;
      // if (!isResetFields) return;
      reset();
    },
  }));

  // 上一步 下一步 提交按钮
  const renderSubmitter = () => {
    if (formSubmitterRef.current?.length <= 0) {
      return null;
    }

    const currentSubmitter = formSubmitterRef.current[stepNum]; // 当前from的配置

    if (currentSubmitter === false || currentSubmitter == null) {
      return null;
    }

    const initProps = {
      prevButtonProps: {
        disabled: loading || !isReady,
        ...currentSubmitter?.prevButtonProps,
      },
      nextButtonProps: {
        loading,
        disabled: !isReady,
        ...currentSubmitter?.nextButtonProps,
      },
      submitButtonProps: {
        loading,
        disabled: !isReady,
        ...currentSubmitter?.submitButtonProps,
      },
      onPrev: (e) => {
        prev();
        currentSubmitter?.onPrev?.(e);
      },
      onNext: (e) => {
        currentSubmitter?.onNext?.(e);
      },
      onSubmit: (e) => {
        currentSubmitter?.onSubmit?.(e);
      },
    };

    return (
      <StepsSubmitter
        {...currentSubmitter}
        form={formInstanceListRef.current[stepNum]}
        {...initProps}
      />
    );
  };
  const submitterDom = renderSubmitter();

  // 每个表单dom
  const formDom = childs.map((itemFrom: any, index) => {
    const isCurrentIndex = stepNum === index;
    const name = itemFrom.props?.name || index + ''; // 每个表单的name 没有则用index
    const currentSubmitter = formSubmitterRef.current[stepNum]; // 当前from的配置
    const buttonAlign = (submitter as Record<string, any>)?.buttonAlign;

    const config = {
      submitter: false, // 不渲染LForm自带的提交重置按钮
      contentRender: (dom: ReactNode) => (
        <>
          {/* 渲染form主体 */}
          {stepFormRender ? stepFormRender(dom, index) : dom}
          {/* 渲染操作上一步 下一步 提交按钮 */}
          {!stepsFormRender && isCurrentIndex ? (
            <Form.Item
              wrapperCol={currentSubmitter?.wrapperCol}
              className={`${prefixCls}-item-submitter`}
              style={{
                marginBottom: 0,
                paddingLeft: typeof buttonAlign === 'number' ? `${buttonAlign}px` : 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: typeof buttonAlign === 'string' ? buttonAlign : 'initial',
                }}
              >
                {submitterDom}
              </div>
            </Form.Item>
          ) : null}
        </>
      ),
    };
    return (
      <div
        className={classNames(`${prefixCls}-item`, {
          [`${prefixCls}-item-active`]: isCurrentIndex,
        })}
        style={{ display: isCurrentIndex ? 'block' : 'none' }} // 只显示当前步骤条的form
        key={name}
      >
        {cloneElement(itemFrom, {
          ...config,
          ...formProps,
          stepNum: index,
          name,
        })}
      </div>
    );
  });

  // useEffect(() => {
  //   // console.log('forgetUpdate ');
  //   // 强制更新一次 绑定每个步骤的form实例 这种方法如果在Modal可能取不到form实例
  //   forgetUpdate();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // 步骤条
  const renderStepsDom = () => {
    if (!Array.isArray(stepsConfigRef.current) || stepsConfigRef.current.length <= 0) {
      return null;
    }
    const dom = <Steps {...stepsProps} items={stepsConfigRef.current} current={stepNum} />;
    return stepsRender ? stepsRender(dom, stepsConfigRef.current) : dom;
  };
  const stepsDom = renderStepsDom();

  const formContentDom = (
    <div className={classnames(`${prefixCls}-content`, contentClassName)}>{formDom}</div>
  );
  const stepsContentDom = <div className={`${prefixCls}-top`}> {stepsDom}</div>;

  return (
    <StepsFormContext.Provider
      value={{
        current: stepNum,
        total: submitStepNum,
        formInstanceListRef,
        formInitialValues,
        onFormFinish,
        next,
        submit,
        loading,
        setLoading,
        forgetUpdate,
      }}
    >
      {stepsFormRender ? (
        stepsFormRender(stepsContentDom, formContentDom, submitterDom)
      ) : (
        <div className={classnames(prefixCls, className)}>
          {stepsContentDom}
          {formContentDom}
        </div>
      )}
    </StepsFormContext.Provider>
  );
};

StepsForm.StepForm = StepForm;

export type { LStepFormProps } from './StepForm';
export type { LStepsFormSubmitterProps } from './StepsSubmitter';

export default StepsForm;
