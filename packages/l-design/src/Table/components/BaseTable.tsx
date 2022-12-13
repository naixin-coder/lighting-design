import { usePagination } from 'ahooks';
import type { CardProps, FormInstance } from 'antd';
import { Card, ConfigProvider, Space, Spin, Table } from 'antd';
import type { Key } from 'antd/es/table/interface';
import type { ColumnsType, TableProps } from 'antd/lib/table';
import classnames from 'classnames';
import type { CSSProperties, FC, MutableRefObject, ReactElement, ReactNode } from 'react';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { LQueryFormProps } from '../../Form/components/QueryForm';
import TableContext from '../TableContext';
import SearchForm, { LIGHTD_CARD } from './SearchFrom';
import './styles.less';
import type { ToolbarActionConfigProps } from './ToolBarAction';
import ToolbarAction from './ToolBarAction';

export type BaseTableProps = {
  /** 表格是否需要排序序号 */
  isSort: boolean;
  /** 表格 表单是否准备好 false时表格不会请求 表单不能提交查询 */
  isReady?: boolean;
  /** 全屏表格的背景颜色 */
  fullScreenBackgroundColor?: string;
  /** 表格内容是否换行 */
  nowrap?: boolean;
  /** 异步请求函数额外参数 */
  requestParams: Record<string, any>;
  /** 异步请求函数 */
  request: (
    params: {
      current: number;
      pageSize: number;
      formValues?: Record<string, any>;
      [key: string]: any;
    },
    requestType: RequestType,
  ) => Promise<{ success: boolean; data: Record<string, any>[]; total: number }>;
  /** 是否自动请求 */
  autoRequest?: boolean;
  /** 查询表单的实例 */
  formRef?: MutableRefObject<FormInstance | undefined> | ((ref: FormInstance) => void);
  /** 表格的实例 包含一些方法 */
  tableRef?: MutableRefObject<any | undefined>;
  /** 是否占满剩余空间 */
  isSpace?: boolean;
  /** 表格最外层div类名 */
  rootClassName?: string;
  /** 表格额外类名 */
  tableClassName?: string;
  /** 表格额外style */
  tableStyle?: CSSProperties;
  /** 查询表单外层的CardProps*/
  formCardProps?: CardProps;
  /** 表格外层的CardProps*/
  tableCardProps?: CardProps;
  /** 表格列 */
  columns: ColumnsType<any>;
  /** 是否显示toolbar */
  showToolbar?: boolean;
  /** 配置内置表格工具栏 与Space组件有相同属性 showToolbar为 true 时生效*/
  toolbarActionConfig?: ToolbarActionConfigProps;
  /** 重新渲染toolBar 包括内置表格工具 */
  toolbarRender?: (ToolbarActionDom: ReactNode) => ReactNode;
  /** 重新渲染整个表格 */
  tableRender?: (
    optionsDom: {
      /** 表单dom */
      searchFormDom: ReactNode;
      /** 工具栏dom */
      toolbarDom: ReactNode;
      /**   table上面额外Dom 如果没有配置则没有 */
      tableExtraDom: ReactNode;
      /**   table主体Dom 包含工具栏Dom  */
      tableDom: ReactNode;
      /** 整个表格Dom包含全部Dom */
      finallyDom: ReactNode;
    },
    props: BaseTableProps,
  ) => ReactElement;
  /** 重新渲染表格内容 */
  contentRender?: (data: Record<string, any>[]) => ReactNode;
  /** 整个toolBar的左侧 */
  toolbarLeft?: ReactNode;
  /** 整个toolBar的右侧 在内置表格工具左侧 */
  toolbarRight?: ReactNode;
  /** 表格上部区域 */
  tableExtra?: ReactNode;
  /** 表单查询框组 */
  formItems?: Exclude<ReactNode, string | number | boolean | null | undefined>[];
  /** 查询表单初始值 */
  formInitialValues?: Record<string, any>;
  /** 查询表单LQueryFormProps */
  queryFormProps?: LQueryFormProps;
} & Omit<TableProps<Record<string, any>>, 'columns'>;

export type RequestType = 'onSearch' | 'onReload' | 'onReset';
export const LIGHTD_TABLE = 'lightd-table';

// 显示数据总量
const showTotal = (total: number, range: [value0: Key, value1: Key]) => (
  <span
    className={`${LIGHTD_TABLE}-pagination-showTotal`}
  >{`当前显示${range[0]}-${range[1]} 条，共 ${total} 条数据`}</span>
);

/**
 * 表格组件
 * @param props
 * @returns
 */
const BaseTable: FC<BaseTableProps> = (props) => {
  const {
    isSort = true,
    nowrap,

    formRef,
    tableRef,

    fullScreenBackgroundColor = '#fff',
    requestParams = {},
    request,
    autoRequest = true,
    formInitialValues,
    queryFormProps,
    formCardProps,
    tableCardProps,

    tableExtra,
    tableRender,
    showToolbar = true,
    isReady = true,
    toolbarActionConfig = {
      showFullscreen: true,
    },
    toolbarRender,
    toolbarLeft,
    toolbarRight,

    loading: outLoading,
    contentRender,

    rootClassName,
    tableClassName,
    tableStyle,
    size: outSize = 'middle',
    columns: outColumns = [],

    formItems = [],

    pagination: outPagination,

    ...restProps
  } = props;

  const [currentColumns, setCurrentColumns] = useState(outColumns);
  const [currentSize, setCurrentSize] = useState(outSize);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const rootDefaultStyle = isFullScreen
    ? { background: fullScreenBackgroundColor, overflow: 'auto', padding: 24 }
    : {};

  // 绑定SearchForm组件form实例在内部
  const queryFormRef = useRef<FormInstance | null>(null);
  // 绑定SearchForm组件form实例在外部
  const handleFormRef = useCallback(
    (refValue: FormInstance) => {
      queryFormRef.current = refValue;
      if (formRef) {
        if (typeof formRef === 'function') {
          formRef(refValue);
        } else {
          formRef.current = refValue;
        }
      }
    },
    [formRef],
  );

  const outPaginationCurrent = useMemo(() => {
    return (outPagination && (outPagination.defaultCurrent || outPagination.current)) || 1;
  }, [outPagination]);

  const outPaginationPageSize = useMemo(() => {
    return (outPagination && (outPagination.defaultPageSize || outPagination.pageSize)) || 10;
  }, [outPagination]);

  const hasFromItems = useMemo(() => Array.isArray(formItems) && formItems.length > 0, [formItems]);

  const currentLoading = useMemo(() => {
    if (!outLoading || typeof outLoading === 'boolean') {
      return { spinning: outLoading };
    }
    return outLoading;
  }, [outLoading]);

  // request请求
  const {
    data,
    loading: requestLoading,
    run,
    refresh,
    mutate,
    params,
    pagination: paginationAction,
  } = usePagination(
    async (arg, requestType) => {
      const res = await request(
        {
          ...arg,
          ...requestParams,
        },
        requestType,
      );
      if (!res?.success) {
        return { list: [], total: 0 };
      }
      return {
        list: res.data,
        total: res.total,
      };
    },
    {
      // refreshDeps: requestParams,
      manual: true,
      defaultCurrent: outPaginationCurrent,
      defaultPageSize: outPaginationPageSize,
    },
  );

  // 重置数据，从第一页开始显示、查询数据
  const handleReset = useCallback(() => {
    if (hasFromItems) {
      queryFormRef.current?.resetFields();
      Promise.resolve().then(() => {
        queryFormRef.current?.submit();
      });
    } else {
      paginationAction.changeCurrent(1);
    }
  }, [hasFromItems, paginationAction]);

  // 根据条件，从第一页开始显示、查询数据
  const handleSearch = useCallback(
    (type = 'onSearch') => {
      if (hasFromItems) {
        const formValues = queryFormRef.current?.getFieldsValue();
        return run(
          {
            current: 1,
            pageSize: outPaginationPageSize,
            formValues: formValues,
          },
          type,
        );
      } else {
        paginationAction.changeCurrent(1);
      }
    },
    [hasFromItems, outPaginationPageSize, paginationAction, run],
  );

  // 根据当前条件和页码 查询数据
  const handleReload = useCallback(
    (type = 'onReload') => {
      if (hasFromItems) {
        const formValues = queryFormRef.current?.getFieldsValue();
        return run(
          {
            current: paginationAction?.current,
            pageSize: paginationAction?.pageSize,
            formValues: formValues,
          },
          type,
        );
      } else {
        paginationAction.changeCurrent(paginationAction?.current);
      }
    },
    [hasFromItems, paginationAction, run],
  );

  // 表单查询
  const handleSearchFormFinish = useCallback(
    (formValues: Record<string, any>) => {
      return run(
        {
          ...params[0],
          current: 1,
          pageSize: outPaginationPageSize,
          formValues: formValues,
        },
        'onSearch',
      );
    },
    [outPaginationPageSize, params, run],
  );

  // 默认 onReset 中已经重置表单，这里只从第一页开始显示、查询数据请求
  // const handleSearchFormReset = useCallback(() => {
  //   handleSearch('onReset');
  // }, [handleSearch]);

  // 表格分页排序等改变时
  const handleTableChange = useCallback(
    (pagination: Record<string, any>) => {
      // console.log('pagination ', pagination);
      // console.log('filters ', filters);
      // console.log('sorter ', sorter);
      // console.log('extra ', extra);
      if (hasFromItems) {
        const formValues = queryFormRef.current?.getFieldsValue();
        return run(
          {
            current: pagination.current,
            pageSize: pagination.pageSize,
            formValues: formValues,
          },
          'onReload',
        );
      } else {
        paginationAction.changeCurrent(pagination?.current);
      }
    },
    [hasFromItems, paginationAction, run],
  );

  // 暴露外部方法
  useImperativeHandle(tableRef, () => ({
    // 根据条件，当前页、刷新数据
    // onReload: refresh,
    onReload: handleReload,
    // 重置数据，从第一页开始显示、查询数据
    onReset: handleReset,
    // 根据条件，从第一页开始显示、查询数据
    onSearch: handleSearch,
    // 表格根标签
    rootRef: rootRef,
    // 表格数据
    tableData: data?.list ?? [],
    // 页码信息
    pagination: {
      current: paginationAction.current,
      pageSize: paginationAction.pageSize,
    },
  }));

  useEffect(() => {
    if (isSort) {
      const sortColumn = {
        align: 'center',
        title: '序号',
        width: 70,
        // fixed: 'left',
        render: (_, __, index: number) => {
          return (
            <>{(paginationAction?.current - 1) * (paginationAction?.pageSize || 0) + index + 1}</>
          );
        },
      };
      setCurrentColumns([sortColumn, ...outColumns]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSort, outColumns, paginationAction.current, paginationAction?.pageSize]);

  // 初始化请求
  useEffect(() => {
    if (autoRequest && isReady) {
      if (hasFromItems) {
        Promise.resolve().then(() => {
          queryFormRef.current?.submit();
        });
      } else {
        paginationAction.changeCurrent(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRequest, hasFromItems, isReady]);

  const ToolbarActionDom = (
    <ToolbarAction
      {...toolbarActionConfig}
      showColumnSetting={contentRender ? false : toolbarActionConfig?.showColumnSetting}
      showDensity={contentRender ? false : toolbarActionConfig?.showDensity}
      className={`${LIGHTD_TABLE}-toolbar-action`}
    />
  );
  // contentRender
  const toolbarDom = showToolbar ? (
    <div className={`${LIGHTD_TABLE}-toolbar`}>
      <div className={`${LIGHTD_TABLE}-toolbar-content-left`}>{<Space>{toolbarLeft}</Space>}</div>
      <div className={`${LIGHTD_TABLE}-toolbar-content-right`}>
        <Space>
          {toolbarRight}
          {ToolbarActionDom}
        </Space>
      </div>
    </div>
  ) : null;

  const tableDom = (
    <Spin {...currentLoading} spinning={!!currentLoading?.spinning || requestLoading}>
      <Card bordered={false} className={LIGHTD_CARD} {...tableCardProps}>
        {toolbarRender ? toolbarRender(ToolbarActionDom) : toolbarDom}
        <Table
          components={{
            table: contentRender
              ? () => contentRender(data?.list ?? []) as unknown as any
              : undefined,
          }}
          className={tableClassName}
          style={tableStyle}
          size={currentSize}
          columns={currentColumns}
          // loading={!!currentLoading?.spinning || requestLoading}
          dataSource={data?.list || []}
          onChange={handleTableChange}
          pagination={
            outPagination !== false
              ? {
                  showTotal,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  ...outPagination,
                  current: paginationAction?.current,
                  pageSize: paginationAction?.pageSize,
                  total: paginationAction?.total,
                }
              : false
          }
          {...restProps}
          scroll={{ ...(nowrap ? { x: true } : {}), ...restProps?.scroll }}
        />
      </Card>
    </Spin>
  );

  const searchFormDom = (
    <SearchForm
      isReady={isReady}
      loading={!!currentLoading?.spinning || requestLoading}
      ref={handleFormRef}
      cardProps={formCardProps}
      onFinish={handleSearchFormFinish}
      // onReset={handleSearchFormReset}
      formItems={formItems}
      initialValues={formInitialValues}
      {...queryFormProps}
    />
  );

  // const renderTableDom = () => (tableRender ? tableRender(tableDom, props) : tableDom);
  // const TableConentDom = contentRender ? contentRender(data?.list ?? []) : tableDom;

  const finallyDom = (
    // 根节点注册
    <TableContext.Provider
      value={{
        // reload: refresh,
        reload: handleReset,
        size: currentSize,
        setSize: setCurrentSize,
        columns: outColumns,
        setColumns: setCurrentColumns,
        rootRef: rootRef,
        setFullScreen,
      }}
    >
      <div
        ref={rootRef}
        style={rootDefaultStyle}
        className={classnames(LIGHTD_TABLE, rootClassName, {
          [`${LIGHTD_TABLE}-fullScreen`]: isFullScreen,
        })}
      >
        {searchFormDom}
        {tableExtra}
        {tableDom}
      </div>
    </TableContext.Provider>
  );

  const returnDom = tableRender
    ? tableRender(
        {
          searchFormDom: searchFormDom,
          toolbarDom: toolbarDom,
          tableExtraDom: tableExtra,
          tableDom: tableDom,
          finallyDom: finallyDom,
        },
        props,
      )
    : finallyDom;

  if (!toolbarActionConfig?.showFullscreen) {
    return returnDom;
  }
  return (
    // 处理表格在全屏状态下 ant一些弹出层组件()无法显示问题
    // 全屏本质上是把你的表格区域 fixed 了，所以你需要把 Modal等组件 的 getPopupContainer 设置为了 table 的区域
    <ConfigProvider getPopupContainer={() => rootRef.current || document.body}>
      {returnDom}
    </ConfigProvider>
  );
};

export default BaseTable;
