import { LTooltip } from 'lighting-design';
import type { FC } from 'react';
import styles from './index2.less';

const Index: FC = () => {
  return (
    <LTooltip
      className={styles.tooltip}
      tipClassName={styles.tooltipItem}
      title={
        <div className={styles.title}>
          <img
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F010bbc5d4cd7b9a8012187f418a507.gif&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1669440953&t=cf0904cb3ab69db474e1b423ed60cde4"
            alt=""
            width={200}
            height={100}
            style={{
              marginBottom: 10,
            }}
          />
          自定义气泡
        </div>
      }
    >
      <div className={styles.content}>自定义气泡</div>
    </LTooltip>
  );
};

export default Index;
