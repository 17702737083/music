import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Table, Tag, Space } from 'antd';
import { ModalForm } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { getSignRecordListByReferenceId } from '@/components/OA/OASign/service';
import { useIntl } from '@/.umi/plugin-locale/localeExports';
import './index.less'
import { SignRecordDTO } from '@/components/OA/OASign/data';
import { findAll } from './service';
// import { useModel } from '@/.umi/plugin-model/useModel';
import { useModel } from 'umi';
import * as xlsx from 'xlsx'
import { dateFormat } from '../util';

const columnSign = [
    {
        title: '签核步骤',
        dataIndex: 'step',
    }, {
        title: '签核步骤',
        dataIndex: 'stepName',
    }, {
        title: '原始签核人',
        dataIndex: 'signerEmployeeNameListString',
    }, {
        title: '实际签核人',
        dataIndex: 'actualSignEmployeeName',
    }, {
        title: '实际签核人英文名',
        dataIndex: 'actualSignEmployeeEnName',
    },
    {
        title: '签核状态',
        dataIndex: 'actualSignStatus',
        render: (_, record) => {
            switch (record.actualSignStatus) {
                case "A":
                    return <Tag icon={<CheckCircleOutlined />} color="success">
                        已同意
                    </Tag>
                    break;
                case "P":
                    return <Tag icon={<SyncOutlined />} color="processing">
                        进行中
                    </Tag>
                    break;
                case "R":
                    return <Tag icon={<CloseCircleOutlined />} color="error">
                        已驳回
                    </Tag>
                    break;
                case "X":
                    return <Tag icon={<ExclamationCircleOutlined />} color="warning">
                        已作废
                    </Tag>
                    break;
                case "N":
                    return <Tag icon={<ClockCircleOutlined />} color="default">
                        待签核
                    </Tag>
                    break;
                case "C":
                    return <Tag icon={<MinusCircleOutlined />} color="default">
                        已取消
                    </Tag>
                    break;
                default:
                    return <Tag icon={<ClockCircleOutlined />} color="default">
                        未知状态{record.actualSignStatus}
                    </Tag>
                    break;
            }
        },
    },
    {
        title: '签核意见',
        dataIndex: 'actualSignComment',
    }, {
        title: '签核时间',
        dataIndex: 'actualSignDateTime',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];


export default function index() {

    const intl = useIntl();

    const actionRef = useRef<ActionType>();

    const [list, setList] = useState([]);

    //签核数据
    const [signRecordDTOList, setSignRecordDTOList] = useState<SignRecordDTO[]>([]);

    const { initialState } = useModel("@@initialState");

    const columns: ProColumns[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            // className: "v-center",
        },
        {
            title: '单号',
            dataIndex: 'formId',
            copyable: true,
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '单据类型',
            dataIndex: 'billType',
            ellipsis: true,
            filters: true,
            onFilter: true,
        },
        {
            title: '费用类别',
            dataIndex: 'costAlias',
            ellipsis: true,
            filters: true,
            onFilter: true,
        },
        {
            title: '费用项目',
            dataIndex: 'costProject',
            ellipsis: true,
            filters: true,
            onFilter: true,
        },
        {
            title: '归属年月',
            dataIndex: 'costAffiliationDate',
            ellipsis: true,
            filters: true,
            onFilter: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            filters: true,
            onFilter: true,
            valueType: 'select',
            valueEnum: {
                all: { text: '全部' },
                open: {
                    text: '未送核',
                },
                signing: {
                    text: '签核中',
                },
                finenceSigned: {
                    text: '财务签核',
                },
                signed: {
                    text: '已签核',
                },
                closed: {
                    text: '已入账',
                },
                obsolete: {
                    text: '已作废',
                },
                reject: {
                    text: '驳回',
                },
            },
        },
        {
            title: '创建人',
            dataIndex: 'cruser',
        },
        {
            title: '创建时间',
            dataIndex: 'crdate',
            valueType: 'dateTime',
        },
        {
            title: '操作',
            valueType: 'option',
            fixed: 'right',
            render: (text, row, record, _, action) => [
                <ModalForm
                    title="签核进度"
                    width={85 + '%'}
                    trigger={<Button type="link" onClick={async () => {
                        console.log(row.formId, "---------------------------------------------");
                        //接收两个参数，1，签核流程key，（truck.uploadTruckInfoSignFlow）2，单号(WKS202105080000142465)
                        const result: any = await getSignRecordListByReferenceId(row.formId);
                        // const result = await generateSignRecordListByDictKey("truck.uploadTruckInfoSignFlow", "WKS202105080000142465");
                        console.log(result);
                        if (result.errorCode == 0) {
                            if (result.data && result.data.list.length > 0) {
                                setSignRecordDTOList(result.data.list as SignRecordDTO[]);
                            }
                        } else {
                            message.error(result.errorMessage);
                        }
                    }}>签核进度</Button>}
                    submitter={{
                        submitButtonProps: {
                            style: {
                                display: 'none',
                            },
                        },
                    }}
                    onFinish={async (values) => {
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}

                >
                    <Table columns={columnSign} dataSource={signRecordDTOList}
                    />
                </ModalForm>,
                <Button type="link" onClick={(e) => {
                    const param = row.formId.toString().substring(0, 2);
                    console.log(param, "e");
                    if (param == 'EG') {
                        window.location.href = "/finance/epa/applicationForm/costEstimateApportion?referenceId=" + row.formId;
                    } else if (param == 'EQ') {
                        window.location.href = "/finance/epa/applicationForm/cashRequirement?referenceId=" + row.formId;
                    }
                    else if (param == 'EJ') {
                        window.location.href = "/finance/epa/applicationForm/demandNote?referenceId=" + row.formId;
                    }
                }}>
                    详情
                </Button>,
            ],
        },
    ];

    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ['序号', '单号', '单据类型', '费用类别',
                '费用项目', '归属年月', '状态','创建人','创建时间']
        ]
        list.forEach((item: any, index: number) => {
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.formId ? item.formId : ''}`,
                `${item.billType ? item.billType : ''}`,
                `${item.costAlias ? item.costAlias : ''}`,
                `${item.costProject ? item.costProject : ''}`,
                `${item.costAffiliationDate ? item.costAffiliationDate : ''}`,
                `${item.state ? item.state : ''}`,
                `${item.cruser ? item.cruser : ''}`,
                `${dateFormat(item.crdate,'Y-m-d H:i:s')}`,
            ];
        })
        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            { wch: 10 },
            { wch: 15 },
            { wch: 10 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, '单据信息.xlsx')
    }
    return (
        <PageContainer>
            <ProTable
                // tableClassName={'v-center'}
                dataSource={list}
                columns={columns}
                scroll={{ x: 1500 }}
                actionRef={actionRef}
                // toolBar={() => {
                //     <Button type="primary" onClick={downloadData} >
                //         下载
                //     </Button>
                // }}
                toolBarRender={() => [
                    <Button type="primary" onClick={downloadData} >
                           下载
                        </Button>
                  ]}
                request={
                    async (params = {}, sort, filter) => {
                        console.log(params, "params");
                        console.log(sort, filter);
                        if (params.state == '' || params.state == undefined) {
                            params.state = 'open';
                        }
                        if (params.state == "all") {
                            params.state = '';
                        };
                        params.departmentId = initialState?.currentUser?.employeeInfoDTO?.deptid;
                        await findAll(params).then(res => {
                            if (res.code == 200) {
                                setList(res.data);
                            } else {
                                setList([]);
                                message.info("您部门还未有可查询单子！！");
                            }
                            console.log(res)
                        });
                        // await NetUtil.post(NetUtil.API.findAll, params)
                        //     .then(res => {
                        //         if (res.code == 200) {
                        //             setList(res.data);
                        //         } else {
                        //             setList([]);
                        //             message.error(res.message);
                        //         }
                        //         console.log(res)
                        //     })
                    }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                    span: 6,
                }}
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 5,
                }}
                dateFormatter="string"
                headerTitle=""
            />
        </PageContainer>
    );


}


