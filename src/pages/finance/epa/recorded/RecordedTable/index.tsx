import React, { useRef, useState } from 'react';
import { ProColumns, ActionType, EditableProTable } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message} from 'antd';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@/.umi/plugin-locale/localeExports';
import { useModel } from 'umi';
import { SaSummonSource } from '../../data';
import * as xlsx from 'xlsx';
import { findSaSummons } from '../DoRecorded/service';
import {  toInputAccount } from '../ToRecorded/service';
import { changeSaSummonsNAndState } from './service';


const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};




//入账报表查询

const ToRecorded: React.FC = () => {
    const columnSummon = [
        {
            title: '单号',
            dataIndex: 'formId',
            width: 110,
        },
        {
            title: 'sequenceNo',
            dataIndex: 'sequenceNo',
            width: 110,
        },
        {
            title: 'companyCode',
            dataIndex: 'companyCode',
            width: 110,
        },
        {
            title: 'documentDate',
            dataIndex: 'documentDate',
            width: 110,
        },
        {
            title: 'postingDate',
            dataIndex: 'postingDate',
            width: 110,
        },
        {
            title: 'documentType',
            dataIndex: 'documentType',
            width: 110,
        },
        {
            title: 'currencyKey',
            dataIndex: 'currencyKey',
            width: 110,
        },
        {
            title: 'exchangeRateDirectQuotation',
            dataIndex: 'exchangeRateDirectQuotation',
            width: 110,
        },
        {
            title: 'reference',
            dataIndex: 'reference',
            width: 110,
        },
        {
            title: 'documentHeaderText',
            dataIndex: 'documentHeaderText',
            width: 110,
        },
        {
            title: 'postingKey',
            dataIndex: 'postingKey',
            width: 110,
        },
        {
            title: 'account',
            dataIndex: 'account',
            width: 110,
        },
        {
            title: 'amountInDocumentCurrency',
            dataIndex: 'amountInDocumentCurrency',
            width: 110,
        },
        {
            title: 'amountInLocalCurrency',
            dataIndex: 'amountInLocalCurrency',
            width: 110,
        },
        {
            title: 'costCenter',
            dataIndex: 'costCenter',
            width: 110,
        },
        {
            title: 'profitCenter',
            dataIndex: 'profitCenter',
            width: 110,
        },
        {
            title: 'assignmentNumber',
            dataIndex: 'assignmentNumber',
            width: 110,
        },
        {
            title: 'taxCode',
            dataIndex: 'taxCode',
            width: 110,
        },
        {
            title: 'itemText',
            dataIndex: 'itemText',
            width: 110,
        },
        {
            title: 'orderNumber',
            dataIndex: 'orderNumber',
            width: 110,
        },
        {
            title: 'customerGroupCode',
            dataIndex: 'customerGroupCode',
            width: 110,
        },
        {
            title: 'plant',
            dataIndex: 'plant',
            width: 110,
        },
        {
            title: 'businessType',
            dataIndex: 'businessType',
            width: 110,
        },
        {
            title: 'reference1',
            dataIndex: 'reference1',
            width: 110,
        },
        {
            title: 'reference2',
            dataIndex: 'reference2',
            width: 110,
        },
        {
            title: 'reference3',
            dataIndex: 'reference3',
            width: 110,
        },
        {
            title: 'excelLineItemNo',
            dataIndex: 'excelLineItemNo',
            width: 110,
        },
        {
            title: 'tradingPartner',
            dataIndex: 'tradingPartner',
            width: 110,
        },
        {
            title: 'partnerProfitCenter',
            dataIndex: 'partnerProfitCenter',
            width: 110,
        }
        ,
        {
            title: 'flag',
            dataIndex: 'flag',
            width: 110,
        },
        {
            title: 'crdateTime',
            dataIndex: 'crdateTime',
            valueType: 'dateTime',
            width: 110,
        },
        {
            title: 'crdateBy',
            dataIndex: 'crdateBy',
            width: 110,
        },
        {
            title: 'updateTime',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            width: 110,
        },
        {
            title: 'updateBy',
            dataIndex: 'updateBy',
            width: 110,
        },
        // {
        //     title: '操作',
        //     valueType: 'option',
        //     width: 120,
        //     fixed: 'right',
        //     render: (text, record, _, action) => [
        //         <ModalForm<{
        //             name: string;
        //             company: string;
        //         }>
        //             title="审核"
        //             formRef={summonRef}
        //             layout="horizontal"
        //             width={70 + '%'}
        //             visible={modalVisible}
        //             trigger={
        //                 <Button type="link" onClick={async () => {
        //                     await (summonRef.current as any).setFieldsValue(record);
        //                     // await waitTime(2000);
        //                     console.log(record);
        //                     setModalVisible(true);
        //                 }}>
        //                     编辑
        //                 </Button>
        //             }
        //             modalProps={{
        //                 onCancel: () => {
        //                     setModalVisible(false);
        //                     console.log('run');
        //                 }
        //             }}
        //             onFinish={async (values) => {
        //                 console.log(values);
        //                 console.log(values.name);
        //                 message.success('提交成功');
        //                 setModalVisible(false);
        //                 return true;
        //             }}
        //         >
        //             <ProForm.Group>
        //                 <ProFormText width="xs" name="formId" label={<label style={{ color: 'green' }}>formId</label>} readonly />
        //                 <ProFormText width="xs" name="sequenceNo" label="sequenceNo" readonly />
        //                 <ProFormText width="xs" name="companyCode" label="companyCode" readonly />
        //                 <ProFormText width="xs" name="documentDate" label="documentDate" readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="sm" name="postingDate" label={<label style={{ color: 'green' }}>postingDate</label>} />
        //                 <ProFormText width="xs" name="documentType" label="documentType" readonly />
        //                 <ProFormText width="xs" name="currencyKey" label="currencyKey" readonly />
        //                 <ProFormText width="xs" name="exchangeRateDirectQuotation"
        //                     label={<label style={{ color: 'green', width: 230 }}>exchangeRateDirectQuotation</label>} readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="xs" name="reference" label="reference" readonly />
        //                 <ProFormText width="xs" name="documentHeaderText" label="documentHeaderText" readonly />
        //                 <ProFormText width="xs" name="postingKey" label="postingKey" readonly />
        //                 <ProFormText width="sm" name="account" label={<label style={{ color: 'green' }}>account</label>} />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="xs" name="amountInDocumentCurrency" label="amountInDocumentCurrency" readonly />
        //                 <ProFormText width="xs" name="amountInLocalCurrency" label="amountInLocalCurrency" readonly />
        //                 <ProFormText width="sm" name="costCenter" label={<label style={{ color: 'green' }}>costCenter</label>} />
        //                 <ProFormText width="xs" name="profitCenter" label="profitCenter" readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="sm" name="assignmentNumber" label={<label style={{ color: 'green' }}>assignmentNumber</label>} />
        //                 <ProFormText width="xs" name="taxCode" label="taxCode" readonly />
        //                 <ProFormText width="xs" name="itemText" label="itemText" readonly />
        //                 <ProFormText width="xs" name="orderNumber" label="orderNumber" readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="xs" name="customerGroupCode" label="customerGroupCode" readonly />
        //                 <ProFormText width="xs" name="plant" label="plant" readonly />
        //                 <ProFormText width="xs" name="businessType" label="businessType" readonly />
        //                 <ProFormText width="xs" name="reference1" label="reference1" readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="sm" name="reference2" label={<label style={{ color: 'green' }}>reference2</label>} />
        //                 <ProFormText width="sm" name="reference3" label={<label style={{ color: 'green' }}>reference3</label>} />
        //                 <ProFormText width="xs" name="excelLineItemNo" label="excelLineItemNo" readonly />
        //                 <ProFormText width="xs" name="tradingPartner" label="tradingPartner" readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="xs" name="partnerProfitCenter" label="partnerProfitCenter" readonly />
        //                 <ProFormText width="xs" name="flag" label="flag" readonly />
        //                 <ProFormText width="xs" name="crdateTime" label="crdateTime" readonly />
        //                 <ProFormText width="xs" name="crdateBy" label="crdateBy" readonly />
        //             </ProForm.Group>
        //             <ProForm.Group>
        //                 <ProFormText width="xs" name="updateTime" label="updateTime" readonly />
        //                 <ProFormText width="xs" name="updateBy" label="updateBy" readonly />
        //             </ProForm.Group>

        //         </ModalForm>,
        //         <a
        //             key="editable"
        //             onClick={() => {
        //                 action?.startEditable?.(record.id);
        //             }}
        //         >
        //             编辑
        //         </a>
        //     ],
        // }
    ];

    const intl = useIntl();

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const summonRef = useRef();

    const [list, setList] = useState([]);

    //签核数据
    const [saSummonList, setSaSummonList] = useState<SaSummonSource[]>([]);

    const { initialState } = useModel("@@initialState");

    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ["*sequence No", "Company Code", "Document Date", "Posting Date", "Document Type",
                "Currency Key", 'Exchange Rate Direct Quotation', "Reference", "Document deader text",
                "Posting Key", "Account", "AmountIn document currency", "Amount in local currency",
                "Cost Center", "Profit Center", "Assignment number", "Tax Code", "Item Text", "Order Number",
                "Customer Group/Code", "Plant", "Business Type", "Reference 1", "Reference 2", "Reference 3",
                "Excel Line Item No.", "Trading Partner(at header level)", "Partner Profit Center"]
        ]
        saSummonList.forEach((item: any, index: number) => {
            aoa[Number(index + 1)] = [
                `${item.sequenceNo ? item.sequenceNo : ''}`,
                `${item.companyCode ? item.companyCode : ''}`,
                `${item.documentDate ? item.documentDate : ''}`,

                `${item.postingDate ? item.postingDate : ''}`,
                `${item.documentType ? item.documentType : ''}`,
                `${item.currencyKey ? item.currencyKey : ''}`,

                `${item.exchangeRateDirectQuotation ? item.exchangeRateDirectQuotation : ''}`,
                `${item.reference ? item.reference : ''}`,

                `${item.documentHeaderText ? item.documentHeaderText : ''}`,
                `${item.postingKey ? item.postingKey : ''}`,

                `${item.account ? item.account : ''}`,
                `${item.amountInDocumentCurrency ? item.amountInDocumentCurrency : ''}`,

                `${item.amountInLocalCurrency ? item.amountInLocalCurrency : ''}`,
                `${item.costCenter ? item.costCenter : ''}`,

                `${item.profitCenter ? item.profitCenter : ''}`,
                `${item.assignmentNumber ? item.assignmentNumber : ''}`,

                `${item.taxCode ? item.taxCode : ''}`,
                `${item.itemText ? item.itemText : ''}`,
                `${item.orderNumber ? item.orderNumber : ''}`,

                `${item.customerGroupCode ? item.customerGroupCode : ''}`,
                `${item.plant ? item.plant : ''}`,
                `${item.businessType ? item.businessType : ''}`,

                `${item.reference1 ? item.reference1 : ''}`,
                `${item.reference2 ? item.reference2 : ''}`,
                `${item.reference3 ? item.reference3 : ''}`,

                `${item.excelLineItemNo ? item.excelLineItemNo : ''}`,
                `${item.tradingPartner ? item.tradingPartner : ''}`,
                `${item.partnerProfitCenter ? item.partnerProfitCenter : ''}`,

            ];
        })

        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            // { wch: 10 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }
        ]
        const wb = xlsx.utils.book_new();
        ws["B2"].s = { font: { sz: 14, bold: true, color: { rgb: "red" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, saSummonList[0].reference +'sa分录.xlsx')
    }
    const columns: ProColumns[] = [
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
            width: 300,
            render: (text, row, record, _, action) => [
                <ModalForm
                    title="审核"
                    width={90 + '%'}
                    trigger={<Button type="link" onClick={async () => {
                        const result = await findSaSummons(row.formId, 'Y');
                        console.log(result);
                        if (result.code == 200) {
                            setSaSummonList(result.data);
                        }
                    }}>查看分录</Button>}
                    submitter={{
                        // submitButtonProps: {
                        //     style: {
                        //         display: 'none',
                        //     },
                        // },
                    }}
                    onFinish={async (values) => {
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}

                >
                    <EditableProTable
                        headerTitle="分录信息"
                        onChange={setSaSummonList}
                        columns={columnSummon}
                        value={saSummonList}
                        scroll={{ x: 4000 }}
                        recordCreatorProps={false}
                        pagination={{
                            pageSize: 5,
                        }}
                        toolBarRender={() => [
                            <div style={{ width: 100 + '%', marginRight: 0 }}>
                                <Button type="primary" onClick={downloadData}>
                                    下载
                                </Button>
                            </div>
                        ]}
                        request={(params, sorter, filter) => {
                            return Promise.resolve({
                                data: saSummonList,
                                success: true,
                            });
                        }}
                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onSave: async (key, row) => {

                            },
                            onDelete: async (key, row) => {
                                console.log(row);
                            },
                            onChange: setEditableRowKeys,
                        }}
                    />
                </ModalForm>,
                <Button type="link" onClick={async (e) => {
                    const result = await changeSaSummonsNAndState(row.formId);
                    if (result.code == 200) {
                        message.success({
                            content: "回退成功",
                            duration: 5,
                            style: {
                                marginTop: '20vh',
                            },
                        });
                        listReload();
                    } else {
                        message.error({
                            content: result.message,
                            duration: 5,
                            style: {
                                marginTop: '20vh',
                            },
                        });
                    }
                }}>
                    Return
                </Button>,
                <Button type="link" onClick={async (e) => {
                    message.success("后期开放");
                }}>
                    上抛
                </Button>
            ],
        },
    ];

    const listReload=async ()=>{
        const crdateBy: string = initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '';
        await toInputAccount('closed', 'Y', crdateBy).then(res => {
            if (res.code == 200) {
                setList(res.data);
            } else {
                setList([]);
            }
        });
    }
    return (
        <PageContainer>
            <ProTable
                // tableClassName={'v-center'}
                dataSource={list}
                columns={columns}
                scroll={{ x: 1500 }}
                actionRef={actionRef}
                request={
                    async (params = {}, sort, filter) => {
                        const crdateBy: string = initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '';
                        await toInputAccount('closed', 'Y', crdateBy).then(res => {
                            if (res.code == 200) {
                                setList(res.data);
                            } else {
                                setList([]);
                            }
                            console.log(res)
                        });
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
export default ToRecorded;

