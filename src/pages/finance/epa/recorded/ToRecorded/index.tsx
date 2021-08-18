import React, { useRef, useState } from 'react';
import { ProColumns, ActionType, EditableProTable } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, notification, Upload } from 'antd';
import ProForm, { ModalForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@/.umi/plugin-locale/localeExports';
import { affirmSaSummons, findByCostCtr, findSaSummons, rollbackSaSummons, saveSimpleSummon, toInputAccount } from './service';
import { useModel } from 'umi';
import { SaSummonSource } from '../../data';
import * as xlsx from 'xlsx';
import Icon from '@ant-design/icons';
import './index.less'

//待确认查询

const ToRecorded: React.FC = () => {
    const columnSummon = [
        {
            title: 'Id',
            dataIndex: 'id',
            width: 110,
            hideInTable: true,
        },
        {
            title: '序号',
            render: (text, record, index) => {
                const value =getArrayIndex(saSummonList,record.id)+1;
                return <span>{value}</span>
            },
            width: 60,
            search: false,
          },
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
        {
            title: '操作',
            valueType: 'option',
            width: 120,
            fixed: 'right',
            render: (text, record, _, action) => [
                <ModalForm
                    title="审核"
                    formRef={summonRef}
                    layout="horizontal"
                    width={95 + '%'}
                    visible={modalVisible}
                    trigger={
                        <Button type="link" onClick={async () => {
                            console.log(record, "record");
                            await (summonRef.current as any).setFieldsValue(record);
                            setModalVisible(true);
                        }}>
                            编辑
                        </Button>
                    }
                    modalProps={{
                        onCancel: () => {
                            setModalVisible(false);
                            console.log('run');
                        }
                    }}
                    submitter={{
                        searchConfig: {
                            submitText: '保存',
                            resetText: '取消',
                        },
                    }}
                    onFinish={async (values) => {
                        const res: any =await saveSimpleSummon(values as SaSummonSource);
                        console.log(res,"res");
                        if (res.code == 200) {
                            saSummonList.forEach((item: any, index: number) => {
                                if (item.id === res.data.id) {
                                    item = res.data;
                                }
                            });
                            setSaSummonList(saSummonList);
                            setModalVisible(false);
                            message.success('保存成功');
                        } else {
                            message.error(res.message);
                        }
                        return true;
                    }}
                >
                    <ProForm.Group>
                        <ProFormText width="sm" name="formId" label={<label style={{ color: 'green', width: 140 }}>formId</label>} disabled />
                        <ProFormText width="sm" name="sequenceNo" label={<label style={{ width: 140 }}>sequenceNo</label>} disabled />
                        <ProFormText width="sm" name="companyCode" label={<label style={{ width: 140 }}>companyCode</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="documentDate" label={<label style={{ width: 140 }}>documentDate</label>} disabled />
                        <ProFormText width="sm" name="postingDate" label={<label style={{ color: 'green', width: 140 }}>postingDate</label>} />
                        <ProFormText width="sm" name="documentType" label={<label style={{ width: 140 }}>documentType</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="currencyKey" label={<label style={{ width: 140 }}>currencyKey</label>} disabled />
                        <ProFormText width="sm" name="reference" label={<label style={{ width: 140 }}>reference</label>} disabled />
                        <ProFormText width="sm" name="documentHeaderText" label={<label style={{ width: 140 }}>sequenceNo</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="postingKey" label={<label style={{ width: 140 }}>sequenceNo</label>} disabled />
                        <ProFormText width="sm" name="account" label={<label style={{ color: 'green', width: 140 }}>account</label>} />
                        <ProFormText width="sm" name="costCenter" label={<label style={{ color: 'green', width: 140 }}>costCenter</label>} />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="profitCenter" label={<label style={{ width: 140 }}>profitCenter</label>} disabled />
                        <ProFormText width="sm" name="assignmentNumber" label={<label style={{ color: 'green', width: 140 }}>assignmentNumber</label>} />
                        <ProFormText width="sm" name="taxCode" label={<label style={{ width: 140 }}>taxCode</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="itemText" label={<label style={{ width: 140 }}>itemText</label>} disabled />
                        <ProFormText width="sm" name="orderNumber" label={<label style={{ width: 140 }}>orderNumber</label>} disabled />
                        <ProFormText width="sm" name="customerGroupCode" label={<label style={{ width: 140 }}>customerGroupCode</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="plant" label={<label style={{ width: 140 }}>plant</label>} disabled />
                        <ProFormText width="sm" name="businessType" label={<label style={{ width: 140 }}>businessType</label>} disabled />
                        <ProFormText width="sm" name="reference1" label={<label style={{ width: 140 }}>reference1</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="reference2" label={<label style={{ color: 'green', width: 140 }}>reference2</label>} />
                        <ProFormText width="sm" name="reference3" label={<label style={{ color: 'green', width: 140 }}>reference3</label>} />
                        <ProFormText width="sm" name="excelLineItemNo" label={<label style={{ width: 140 }}>excelLineItemNo</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="tradingPartner" label={<label style={{ width: 140 }}>tradingPartner</label>} disabled />
                        <ProFormText width="sm" name="partnerProfitCenter" label={<label style={{ width: 140 }}>partnerProfitCenter</label>} disabled />
                        <ProFormText width="sm" name="flag" label={<label style={{ width: 140 }}>flag</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="xs" name="exchangeRateDirectQuotation"
                            label={<label style={{ width: 230 }}>exchangeRateDirectQuotation</label>} disabled />
                        <ProFormText width="xs" name="amountInDocumentCurrency" label={<label style={{ width: 230 }}>amountInDocumentCurrency</label>} disabled />
                        <ProFormText width="xs" name="amountInLocalCurrency" label={<label style={{ width: 230 }}>amountInLocalCurrency</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormDatePicker width="sm" name="crdateTime" label={<label style={{ width: 140 }}>crdateTime</label>} disabled />
                        <ProFormText width="sm" name="crdateBy" label={<label style={{ width: 140 }}>crdateBy</label>} disabled />
                        <ProFormDatePicker width="sm" name="updateTime" label={<label style={{ width: 140 }}>updateTime</label>} disabled />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="sm" name="updateBy" label={<label style={{ width: 140 }}>updateBy</label>} disabled />
                        <ProFormText width="sm" name="id" label={<label style={{ width: 140 }}>编号</label>} disabled />
                    </ProForm.Group>
                </ModalForm>,
            ],
        }
    ];

    const intl = useIntl();

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const summonRef = useRef();

    const [list, setList] = useState([]);
    const listRef = useRef();
    //签核数据
    const [saSummonList, setSaSummonList] = useState<SaSummonSource[]>([]);

    const { initialState } = useModel("@@initialState");


    const getArrayIndex = (arr: string | any[], obj: string) => {
        var i = 0;
        var flag = false;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].id == obj) {
                flag = true;
                break;
            }
        }
        if (flag == true) {
            return i;
        } else {
            return -1;
        }
    }
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ["id", "formId", "*sequenceNo", "companyCode", "documentDate", "postingDate", "documentType",
                "currencyKey", 'exchangeRateDirectQuotation', "reference", "documentHeaderText",
                "postingKey", "account", "amountInDocumentCurrency", "amountInLocalCurrency",
                "costCenter", "profitCenter", "assignmentNumber", "taxCode", "itemText", "orderNumber",
                "customerGroupCode", "plant", "businessType", "reference1", "reference2", "reference3",
                "excelLineItemNo", "tradingPartner", "partnerProfitCenter", "crdateTime",
                "crdateBy", 'updateTime', "updateBy"]
        ]
        saSummonList.forEach((item: any, index: number) => {
            console.log(item);
            aoa[Number(index + 1)] = [
                `${item.id ? item.id : ''}`,
                `${item.formId ? item.formId : ''}`,
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

                `${item.crdateTime ? item.crdateTime : ''}`,
                `${item.crdateBy ? item.crdateBy : ''}`,
                `${item.updateTime ? item.updateTime : ''}`,
                `${item.updateBy ? item.updateBy : ''}`,
            ];
        })

        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            // { wch: 10 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 },
            { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
        ]
        const wb = xlsx.utils.book_new();
        ws["B2"].s = { font: { sz: 14, bold: true, color: { rgb: "red" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, saSummonList[0].reference + '--sa分录.xlsx')
    }
    //上传
    const uploadprops = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: (file: Blob, fileList: any) => {
            const fileReader = new FileReader();
            var data: any = [];
            fileReader.onload = async event => {
                const bstr = (event.target as any).result;
                const workbook = xlsx.read(bstr, { type: 'binary' });
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        data = data.concat(xlsx.utils.sheet_to_json(workbook.Sheets[sheet], { raw: false }));
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }
                console.log(data);
                let result = await affirmSaSummons(data as SaSummonSource[]);
                if (result.code == 200) {
                    setSaSummonList(result.data);
                    message.success({
                        content: "确认成功",
                        duration: 5,
                        style: {
                            marginTop: '20vh',
                        },
                    });
                    setModalVisible(false);
                    listReload();
                } else {
                    message.error(result.message);
                }
            }
            fileReader.readAsBinaryString(file);
        },
    };
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
                        const result = await findSaSummons(row.formId, 'N');
                        console.log(result);
                        if (result.code == 200) {
                            setSaSummonList(result.data);
                            //查看分录costCenter是否存在
                            verifyCostCenter(result.data);
                        }
                    }}>分录审核</Button>}
                    submitter={{
                        searchConfig: {
                            submitText: '审核通过',
                            resetText: '取消',
                        },
                    }}
                    onFinish={async (values) => {
                        console.log("审核通过");
                        let errMessage = '';
                        let flag = false;
                        for (var i = 1; i < saSummonList.length; i++) {
                            if((saSummonList[i] as any).costCenter!==null&&(saSummonList[i] as any).costCenter!==''&&(saSummonList[i] as any).costCenter!==undefined){
                                const res = await findByCostCtr((saSummonList[i] as any).costCenter);
                                if (res.code !== 200) {
                                    errMessage = errMessage + "第" + (i + 1) + "行中的costCenter不存在，请确认！！";
                                    flag = true;
                                }
                            }
                        }
                        console.log(flag,"审核通过");
                        if (flag) {
                            notification.error({
                                message: '校验错误提示',
                                description: errMessage,
                                duration: null,
                                top: 30,
                                className: 'notificationName',
                            });
                        } else {
                            const result = await affirmSaSummons(saSummonList as SaSummonSource[]);
                            if (result.code == 200) {
                                setSaSummonList(result.data);
                                message.success({
                                    content: "确认成功",
                                    duration: 5,
                                    style: {
                                        marginTop: '20vh',
                                    },
                                });
                                setModalVisible(false);
                                listReload();
                            } else {
                                message.error(result.message);
                            }
                        }
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
                        actionRef={listRef}
                        pagination={{
                            pageSize: 3,
                        }}
                        toolBarRender={() => [
                            <div style={{ width: 100 + '%', marginRight: 0 }}>
                                <Button type="primary" onClick={downloadData}>
                                    下载
                                </Button>
                                <Upload {...uploadprops}  >
                                    <Button type="ghost" >
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
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
                            onChange: setEditableRowKeys
                        }}
                    />
                </ModalForm>,
                <Button type="link" onClick={async (e) => {
                    const result = await rollbackSaSummons(row.formId, initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
                    if (result.code == 200) {
                        message.success("Return Success");
                        listReload();
                    }
                }}>
                    Return
                </Button>
            ],
        },
    ];
    //查看分录costCenter是否存在
    const verifyCostCenter = (param: any) => {

    }


    const listReload = async () => {
        const crdateBy: string = initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '';
        await toInputAccount('signed', 'N', crdateBy).then(res => {
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
                        await toInputAccount('signed', 'N', crdateBy).then(res => {
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

