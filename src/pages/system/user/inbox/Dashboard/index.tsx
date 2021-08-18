import React, { useState } from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';

const { Statistic, Divider } = StatisticCard;

export default () => {
    const [responsive, setResponsive] = useState(false);

    return (
        <>
            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 640);
                }}
            >
                <StatisticCard.Group direction={responsive ? 'column' : undefined}>
                    <StatisticCard
                        statistic={{
                            title: '总流量(人次)',
                            value: 601986875,
                        }}
                    />
                    <Divider type={responsive ? 'horizontal' : 'vertical'} />
                    <StatisticCard
                        statistic={{
                            title: '付费流量',
                            value: 3701928,
                            description: <Statistic title="占比" value="61.5%" />,
                        }}
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
                                alt="百分比"
                                width="100%"
                            />
                        }
                        chartPlacement="left"
                    />
                    <StatisticCard
                        statistic={{
                            title: '免费流量',
                            value: 1806062,
                            description: <Statistic title="占比" value="38.5%" />,
                        }}
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
                                alt="百分比"
                                width="100%"
                            />
                        }
                        chartPlacement="left"
                    />
                </StatisticCard.Group>
            </RcResizeObserver>
            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 640);
                }}
            >
                <ProCard split="vertical">
                    <StatisticCard
                        colSpan={responsive ? 12 : 6}
                        title="财年业绩目标"
                        statistic={{
                            value: 82.6,
                            suffix: '亿',
                            description: <Statistic title="日同比" value="6.47%" trend="up" />,
                        }}
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/PmKfn4qvD/mubiaowancheng-lan.svg"
                                alt="进度条"
                                width="100%"
                            />
                        }
                        footer={
                            <>
                                <Statistic value="70.98%" title="财年业绩完成率" layout="horizontal" />
                                <Statistic value="86.98%" title="去年同期业绩完成率" layout="horizontal" />
                                <Statistic value="88.98%" title="前年同期业绩完成率" layout="horizontal" />
                            </>
                        }
                    />
                    <StatisticCard.Group
                        gutter={12}
                        colSpan={responsive ? 12 : 18}
                        direction={responsive ? 'column' : undefined}
                    >
                        <StatisticCard
                            statistic={{
                                title: '财年总收入',
                                value: 601987768,
                                description: <Statistic title="日同比" value="6.15%" trend="up" />,
                            }}
                            chart={
                                <img
                                    src="https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg"
                                    alt="折线图"
                                    width="100%"
                                />
                            }
                        >
                            <Statistic
                                title="大盘总收入"
                                value={1982312}
                                layout="vertical"
                                description={<Statistic title="日同比" value="6.15%" trend="down" />}
                            />
                        </StatisticCard>
                        <StatisticCard
                            statistic={{
                                title: '当日排名',
                                value: 6,
                                description: <Statistic title="日同比" value="3.85%" trend="down" />,
                            }}
                            chart={
                                <img
                                    src="https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg"
                                    alt="折线图"
                                    width="100%"
                                />
                            }
                        >
                            <Statistic
                                title="近7日收入"
                                value={17458}
                                layout="vertical"
                                description={<Statistic title="日同比" value="6.47%" trend="up" />}
                            />
                        </StatisticCard>
                        <StatisticCard
                            statistic={{
                                title: '财年业绩收入排名',
                                value: 2,
                                description: <Statistic title="日同比" value="6.47%" trend="up" />,
                            }}
                            chart={
                                <img
                                    src="https://gw.alipayobjects.com/zos/alicdn/zevpN7Nv_/xiaozhexiantu.svg"
                                    alt="折线图"
                                    width="100%"
                                />
                            }
                        >
                            <Statistic
                                title="月付费个数"
                                value={601}
                                layout="vertical"
                                description={<Statistic title="日同比" value="6.47%" trend="down" />}
                            />
                        </StatisticCard>
                    </StatisticCard.Group>
                </ProCard>
            </RcResizeObserver>

            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 640);
                }}
            >
                <StatisticCard.Group direction={responsive ? 'column' : undefined}>
                    <StatisticCard
                        statistic={{
                            title: '冻结金额',
                            value: 20190102,
                            precision: 2,
                            suffix: '元',
                        }}
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
                                alt="直方图"
                                width="100%"
                            />
                        }
                    />
                    <Divider type={responsive ? 'horizontal' : 'vertical'} />
                    <StatisticCard
                        statistic={{
                            title: '设计资源数',
                            value: 234,
                        }}
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
                                alt="直方图"
                                width="100%"
                            />
                        }
                    />
                    <Divider type={responsive ? 'horizontal' : 'vertical'} />
                    <StatisticCard
                        statistic={{
                            title: '信息完成度',
                            value: 5,
                            suffix: '/ 100',
                        }}
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
                                alt="直方图"
                                width="100%"
                            />
                        }
                    />
                </StatisticCard.Group>
            </RcResizeObserver>

            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 640);
                }}
            >
                <ProCard
                    title="数据概览"
                    extra="2019年9月28日 星期五"
                    split={responsive ? 'horizontal' : 'vertical'}
                    headerBordered
                    bordered
                >
                    <ProCard split="horizontal">
                        <ProCard split="horizontal">
                            <ProCard split="vertical">
                                <StatisticCard
                                    statistic={{
                                        title: '昨日全部流量',
                                        value: 234,
                                        description: <Statistic title="较本月平均流量" value="8.04%" trend="down" />,
                                    }}
                                />
                                <StatisticCard
                                    statistic={{
                                        title: '本月累计流量',
                                        value: 234,
                                        description: <Statistic title="月同比" value="8.04%" trend="up" />,
                                    }}
                                />
                            </ProCard>
                            <ProCard split="vertical">
                                <StatisticCard
                                    statistic={{
                                        title: '运行中实验',
                                        value: '12/56',
                                        suffix: '个',
                                    }}
                                />
                                <StatisticCard
                                    statistic={{
                                        title: '历史实验总数',
                                        value: '134',
                                        suffix: '个',
                                    }}
                                />
                            </ProCard>
                        </ProCard>
                        <StatisticCard
                            title="流量走势"
                            chart={
                                <img
                                    src="https://gw.alipayobjects.com/zos/alicdn/_dZIob2NB/zhuzhuangtu.svg"
                                    width="100%"
                                />
                            }
                        />
                    </ProCard>
                    <StatisticCard
                        title="流量占用情况"
                        chart={
                            <img
                                src="https://gw.alipayobjects.com/zos/alicdn/qoYmFMxWY/jieping2021-03-29%252520xiawu4.32.34.png"
                                alt="大盘"
                                width="100%"
                            />
                        }
                    />
                </ProCard>
            </RcResizeObserver>

        </>
    );
};