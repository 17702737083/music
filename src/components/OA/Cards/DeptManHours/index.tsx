import React, { useState } from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import ProjectMan from '../ProjectMan';

const { Statistic } = StatisticCard;

export default () => {
  const [responsive, setResponsive] = useState(false);

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="數據概覽"
        extra="2021年7月9日 星期五"
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '今日全部出勤人數',
                  value: 234,
                  description: <Statistic title="較昨日出勤" value="8.04%" trend="down" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '今日請假人數',
                  value: 8,
                  description: <Statistic title="較昨日請假" value="12.50%" trend="up" />,
                }}
              />
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '進行中專案',
                  value: '12/56',
                  suffix: '个',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '可用崗位職缺',
                  value: '18',
                  suffix: '个',
                }}
              />
            </ProCard>
          </ProCard>
          <StatisticCard
            title="超出工時趨勢"
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg"
                width="100%"
              />
            }
          />
        </ProCard>
        <StatisticCard
          title="專案分布情況"
          chart={
            <ProjectMan />
          }
        />
      </ProCard>
    </RcResizeObserver>
  );
};