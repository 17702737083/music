import React, { useEffect, useRef, useState } from 'react';
import ProCard, { Statistic, StatisticCard, StatisticProps } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';

import Test from './test';
import { toBeSigned } from './service';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { SignRecordDTO } from '@/components/OA/OASign/data';
import { Button, message, Table, Tag } from 'antd';
import { CategoryData, SignHeadDTO } from './data';

const imgStyle = {
    display: 'block',
    width: 42,
    height: 42,
};




export default () => {

    const tableRef = useRef();
    const [responsive, setResponsive] = useState(false);

    const [items, setItems] = useState<CategoryData[]>([{ key: 'All', title: '全部', value: 0, total: true }]);
    //总签核数据
    const [signHeadAll, setSignHeadAll] = useState<SignHeadDTO[]>([]);
    //签核数据考勤
    const [signHeadDTOList, setSignHeadDTOList] = useState<SignHeadDTO[]>([]);
    useEffect(async () => {
        const result = await toBeSigned();
        console.log(result);
        if (result.errorCode == 0) {
            setTagNumber(result.data.list);
            setSignHeadAll(result.data.list)
            setSignHeadDTOList(result.data.list);
        } else {
            message.error(result.errorMessage);
        }

    }, [])

    const columns = [
        {
            title: '大类',
            dataIndex: 'category',
        },
        {
            title: '小类',
            dataIndex: 'subCategory',
        },
        {
            title: '细项',
            dataIndex: 'item',
        },
        {
            title: '单号',
            dataIndex: 'referenceId',
            render: (referenceId: {} | null | undefined) => [
                // <a href={row.callBackUrl + "?referenceId=" + row.referenceId}>{row.referenceId}</a>
                <a key="link" onClick={() => {
                    let url = '';
                    var result_one = signHeadDTOList.some(function (item) {
                        if (item.referenceId == referenceId) { //item.name == "小百里守约"
                            url = item.callBackUrl ? item.callBackUrl : '';
                            return true;  //返回false
                        } else {
                            return false;  //返回false
                        }
                    })
                    if (result_one == true) {
                        console.log(url);
                        window.location.href = url + "?referenceId=" + referenceId;
                    }
                }}>{referenceId}</a>
                // <a key="link">{callBackUrl}</a>,
            ],
        },
        {
            title: '申请人工号',
            dataIndex: 'createBy',
        },
        {
            title: '申请人姓名',
            dataIndex: 'cname',
        },
        {
            title: '申请人英文名',
            dataIndex: 'ename',
        },
        {
            title: '申请人部门',
            dataIndex: 'deptn',
        },
        {
            title: '开单时间',
            dataIndex: 'createTime',
            render: (createTime: string | number | Date) => {
                var date = new Date(createTime)
                return getdate(date);
            },
        }
    ]

    //时间处理
    const getdate = (date: Date) => {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + " " + date.toTimeString().substr(0, 8);
    }

    //切换种类
    const changeData = (Key: string) => {
        console.log(Key);
        if (Key == 'All') {
            console.log(signHeadAll);
            setSignHeadDTOList(signHeadAll);

            // (tableRef.current as any).reload();
        } else {
            const list = signHeadAll.filter(item => {
                if (item.category?.toString() == Key) {
                    return signHeadAll;
                }
            });
            setSignHeadDTOList(list);
            // (tableRef.current as any).reload();
        }
        // switch (Key) {
        //     case '2':
        //         const list2 = signHeadAll.filter(item => {
        //             if (item.category == '行政') {
        //                 return signHeadAll;
        //             }
        //         });
        //         console.log(list2, "list2-------------");
        //         setSignHeadDTOList(list2);
        //         break;
        //     case '3':
        //         const list3 = signHeadAll.filter(item => {
        //             if (item.category == 'ITSR') {
        //                 return signHeadAll;
        //             }
        //         });
        //         console.log(list3, "list3-------------");
        //         setSignHeadDTOList(list3);
        //         break;
        //     case '4':
        //         const list4 = signHeadAll.filter(item => {
        //             if (item.category == '考勤') {
        //                 return signHeadAll;
        //             }
        //         });
        //         console.log(list4, "list4-------------");
        //         setSignHeadDTOList(list4);
        //         break;
        //     case '5':
        //         const list5 = signHeadAll.filter(item => {
        //             if (item.category == '财务') {
        //                 return signHeadAll;
        //             }
        //         });
        //         console.log(list5, "list5-------------");
        //         setSignHeadDTOList(list5);
        //         break;
        //     default:
        //         setSignHeadDTOList(signHeadAll);
        //         break;

        // }
    }

    //获取各个待签核数量
    const setTagNumber = (res) => {
        //去重获取大类
        let obj = {}
        let result = res.reduce(function (preValue, item) {
            obj[item.category] ? '' : obj[item.category] = true && preValue.push(item);
            return preValue
        }, [])//将返回值的初始值定义为空数组
        for (var j = 0; j < result.length; j++) {
            result[j].num = 0;
            for (var i = 0; i < res.length; i++) {
                if (result[j].category == res[i].category) {
                    result[j].num += 1;
                }
            }
        }
        let itemArray: CategoryData[] = [{ key: 'All', title: '全部', value: res.length, total: true }];
        result.forEach(obj => {
            itemArray.push({ key: obj.category, status: 'processing', title: obj.category, value: obj.num })
        });
        setItems(itemArray);
        // let administrationNum = 0;
        // let iisrNum = 0;
        // let attendanceNum = 0;
        // let financeNum = 0;
        // res.forEach(item => {
        //     switch (item.category) {
        //         case '行政':
        //             administrationNum += 1;
        //             break;
        //         case 'ITSR':
        //             iisrNum += 1;
        //             break;
        //         case '考勤':
        //             attendanceNum += 1;
        //             break;
        //         case '财务':
        //             financeNum += 1;
        //             break;
        //     }
        // });
        // setItems([
        //     { key: '1', title: '全部', value: res.length, total: true },
        //     { key: '2', status: 'processing', title: '行政', value: administrationNum },
        //     { key: '3', status: 'processing', title: 'ITSR', value: iisrNum },
        //     { key: '4', status: 'error', title: '考勤', value: attendanceNum },
        //     { key: '5', status: 'success', title: '财务', value: financeNum },
        // ]);
    }

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
                            title: '待签核数量',
                            value: 76,
                            icon: (
                                <img
                                    style={imgStyle}
                                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                                    alt="icon"
                                />
                            ),
                        }}
                    />
                    <StatisticCard
                        statistic={{
                            title: '催单中',
                            value: 5,
                            icon: (
                                <img
                                    style={imgStyle}
                                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                                    alt="icon"
                                />
                            ),
                        }}
                    />
                    <StatisticCard
                        statistic={{
                            title: '超过1天',
                            value: 7,
                            icon: (
                                <img
                                    style={imgStyle}
                                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                                    alt="icon"
                                />
                            ),
                        }}
                    />
                    <StatisticCard
                        statistic={{
                            title: '普通',
                            value: 54,
                            icon: (
                                <img
                                    style={imgStyle}
                                    src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                                    alt="icon"
                                />
                            ),
                        }}
                    />
                </StatisticCard.Group>
            </RcResizeObserver>
            <ProCard
                tabs={{
                    onChange: (Key) => {
                        changeData(Key);
                    },
                }}
            >
                {items.map((item) => {
                    // console.log(item);
                    return <ProCard.TabPane
                        style={{ width: '100%' }}
                        key={item.key}
                        tab={
                            <Statistic
                                layout="vertical"
                                title={item.title}
                                value={item.value}
                                status={item.status as StatisticProps['status']}
                                style={{ width: 120, borderRight: item.total ? '1px solid #f0f0f0' : undefined }}
                            />
                        }
                    >
                        {/* <Test /> */}
                        <Table columns={columns} dataSource={signHeadDTOList} pagination={{ pageSize: 5 }} ref={tableRef}></Table>
                    </ProCard.TabPane>

                })}
            </ProCard>

        </>
    );
};

