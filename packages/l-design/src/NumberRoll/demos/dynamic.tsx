import { Button, Input } from 'antd';
import { LNumberRoll } from 'lighting-design';
import type { FC } from 'react';
import { useState } from 'react';

const center = {
  display: 'flex',
  justifyContent: 'center',
};
const Demo: FC = () => {
  const [count, setCount] = useState<number>(999.99);
  const [value, setValue] = useState<number>(999.99);
  return (
    <>
      <LNumberRoll style={center} value={value} />
      <br />
      <Input.Group compact style={center}>
        <Input
          style={{ width: 200 }}
          value={count}
          placeholder="请输入数字"
          onChange={(e: any) => setCount(e.target.value)}
        />
        <Button type="primary" onClick={() => setValue(Number(count))}>
          设置
        </Button>
      </Input.Group>
    </>
  );
};

export default Demo;
