import type { FormInstance } from 'antd';
import { Button, ConfigProvider } from 'antd';
import type { LTableInstance } from 'lighting-design';
import { LFormItemInput, LTable } from 'lighting-design';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import AddEditModal from './components/AddEditModal';
import { apiGetUserList, columns } from './service';

const Demo1: FC = () => {
  const formRef = useRef<FormInstance>();
  const tableRef = useRef<LTableInstance>();
  const [open, setOpen] = useState(false);
  const [editableRecord, setEditablRecord] = useState<Record<string, any>>();

  const formItems = [
    <LFormItemInput key="0" name="input4" label="输入框" />,
    <LFormItemInput key="1" name="input5" label="输入框" />,
    <LFormItemInput key="2" name="input6" label="输入框" />,
    <LFormItemInput key="3" name="input7" label="输入框" />,
    <LFormItemInput key="4" name="input8" label="输入框" />,
  ];
  return (
    <>
      <LTable
        tableLayout="fixed"
        rootClassName="my-table-root"
        tableClassName="my-table"
        rowKey="key"
        isSort
        loading={{ size: 'large', tip: '加载中...' }}
        tableRef={tableRef}
        queryFormProps={{
          showColsNumber: 3,
        }}
        toolbarLeft={
          <>
            <Button
              type="primary"
              onClick={() => {
                console.log(' tableRef', tableRef);
                setEditablRecord(undefined);
                setOpen(true);
              }}
            >
              新增
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditablRecord({
                  radio: 'a',
                  input: '编辑',
                  select: '1',
                });
                setOpen(true);
              }}
            >
              编辑
            </Button>
          </>
        }
        toolbarRight={<Button type="primary">导出</Button>}
        formItems={formItems}
        formRef={formRef}
        columns={columns}
        request={async (params, requestType) => {
          // console.log('==params==', params);
          // console.log('requestType ', requestType);
          const res: Record<string, any> = await apiGetUserList();
          return {
            success: true,
            data: res.data,
            total: res.total,
          };
        }}
      />
      {/* 如果没有使用表格的全屏toolbarActionConfig.showFullscreen ，就不用包裹 ConfigProvider */}
      <ConfigProvider getPopupContainer={() => tableRef.current?.rootRef.current || document.body}>
        <AddEditModal
          open={open}
          onOpenChange={setOpen}
          data={editableRecord}
          onChange={() => {
            // 数据变动后，重新加载数据
            tableRef.current?.onReload();
          }}
        />
      </ConfigProvider>
    </>
  );
};

export default Demo1;
