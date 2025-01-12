import { Alert,Switch } from 'antd';
import {  } from 'dumi';
import { LSpin } from 'lighting-design';
import type { CSSProperties, FC } from 'react';
import { useState } from 'react';

const flexCenter: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const Index: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div>
      <LSpin loading={loading} tip="玩命加载中...">
        <Alert
          message="Alert message title"
          description="Further details about the context of this alert."
          type="info"
        />
      </LSpin>
      <br />
      <br />
      <div style={flexCenter}>
        加载状态：
        <Switch checked={loading} onChange={(checked) => setLoading(checked)} />
      </div>
    </div>
  );
};

export default Index;
