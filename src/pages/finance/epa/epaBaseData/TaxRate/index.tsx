import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { TaxRateSource } from '../../data';
import { Button, message, Upload } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import * as xlsx from 'xlsx';
import { useModel } from 'umi';
import { baseDownloadTemplateTaxRate, findAllTaxRate, saveAllTaxRate, saveTaxRate } from './service';


type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};


//公司别-费用类别-费用项目-必填栏位

const TaxRate: React.FC = () => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const actionRef = useRef();
    const { initialState } = useModel("@@initialState");

    useEffect(async () => {
        console.log(initialState?.currentUser?.employeeInfoDTO?.emplid);
        const reslult = await findAllTaxRate({} as TaxRateSource);
        console.log(reslult, "reslult");
        if (reslult.code == 200) {
            setDataSource(reslult.data);
        } else {
            message.error(reslult.message);
        }
    }, [])

    useEffect(() => {

    }, [dataSource])


    const uploadprops = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: (file: Blob, fileList: any) => {
            console.log(file.name);
            const fileReader = new FileReader();
            var data: any = [];
            var data2: any = [];
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

                for (let index = 1; index < data.length; index++) {
                    data2[index - 1] = data[index];
                    data2[index - 1].crdateBy = initialState?.currentUser?.employeeInfoDTO?.emplid;
                    data2[index - 1].updateBy = initialState?.currentUser?.employeeInfoDTO?.emplid;
                }
                console.log(data2);
                if (data.length > 0) {
                    const result = await saveAllTaxRate(data2 as TaxRateSource[]);
                    if (result.code == 200) {
                        message.success("上传成功");
                        (actionRef.current as any).reload();
                    } else {
                        message.error(result.message);
                    }
                } else {
                    message.error("上传的数据为空");
                }
            }
            fileReader.readAsBinaryString(file);
        },
    };

    const columns: ProColumns<TaxRateSource>[] = [
        {
            title: '税率代码',
            dataIndex: 'taxRateCode',
            width: 120,
            ellipsis: true,
        },
        {
            title: '税率描述',
            dataIndex: 'taxRateDescribe',
            width: 200,
            ellipsis: true,
        },
        {
            title: '稅率',
            dataIndex: 'taxRate',
            width: 100,
            ellipsis: true,
        },
        {
            title: '发票类型',
            dataIndex: 'invoiceType',
            width: 120,
            ellipsis: true,
        },
        {
            title: '是否有效',
            dataIndex: 'flag',
            valueType: 'select',
            width: 120,
            ellipsis: true,
            valueEnum: {
                Y: {
                    text: '有效',
                },
                N: {
                    text: '无效',
                },
            },
        },
        {
            title: '创建人',
            dataIndex: 'crdateBy',
            ellipsis: true,
            editable: false,
            width: 120,
        },
        {
            title: '创建时间',
            dataIndex: 'crdateTime',
            valueType: 'dateTime',
            ellipsis: true,
            editable: false,
            width: 150,
        },
        {
            title: '修改人',
            dataIndex: 'updateBy',
            ellipsis: true,
            editable: false,
            width: 120,
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            ellipsis: true,
            editable: false,
            width: 150,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 120,
            fixed: 'right',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                // <a
                //     key="delete"
                //     onClick={() => {
                //         setDataSource(dataSource.filter((item) => item.id !== record.id));
                //     }}
                // >
                //     删除
                // </a>,
            ],
        },
    ];

    const downloadtemplate = () => {
        baseDownloadTemplateTaxRate("TaxRate");
    }
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ["序号", "税率代码", "税率描述", "稅率", "发票类型", "是否有效"]
        ]

        console.log(dataSource);
        dataSource.forEach((item: any, index: number) => {
            console.log(item);
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.taxRateCode ? item.taxRateCode : ''}`,
                `${item.taxRateDescribe ? item.taxRateDescribe : ''}`,
                `${item.taxRate ? item.taxRate : ''}`,
                `${item.invoiceType ? item.invoiceType : ''}`,
                `${item.flag ? item.flag : ''}`,
            ];
        })
        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },

        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, 'TaxRate.xlsx')
    }
    return (
        <PageContainer>
            <ProTable<TaxRateSource>
                rowKey="id"
                actionRef={actionRef}
                scroll={{ x: 1000 }}
                // buttonText="Download as XLS"
                toolBarRender={() => [
                    <ModalForm<TaxRateSource>
                        title="新建"
                        trigger={
                            <Button type="primary">
                                <PlusOutlined />
                                新建
                            </Button>
                        }
                        modalProps={{
                            onCancel: () => console.log('run'),
                        }}
                        onFinish={async (values) => {
                            console.log(values);
                            values.crdateBy = initialState?.currentUser?.employeeInfoDTO?.emplid;
                            values.updateBy = initialState?.currentUser?.employeeInfoDTO?.emplid;
                            const result = await saveTaxRate(values as TaxRateSource);
                            if (result.code == 200) {
                                message.success('提交成功');
                                (actionRef.current as any).reload();
                                return true;
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText width="sm" name="taxRateCode" label="税率代码" />
                            <ProFormText width="sm" name="taxRateDescribe" label="税率描述" />
                            <ProFormText width="sm" name="taxRate" label="稅率" />
                            <ProFormText width="sm" name="invoiceType" label="发票类型" />
                            <ProFormSelect
                                options={[
                                    {
                                        value: 'Y',
                                        label: '有效',
                                    },
                                    {
                                        value: 'N',
                                        label: '无效',
                                    },
                                ]}
                                width="xs"
                                name="flag"
                                label="是否有效"
                            />
                        </ProForm.Group>
                    </ModalForm>,
                    <Upload {...uploadprops} >
                        <Button type="ghost" >
                            <Icon type="upload" /> 点击上传
                        </Button>
                    </Upload>,
                    <Button type="primary" onClick={downloadtemplate}>
                        上传模板
                    </Button>,
                    <Button type="primary" onClick={downloadData}>
                        下载
                    </Button>,
                ]}
                pagination={{ defaultPageSize: 6 }}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                    console.log(params, "params");
                    console.log(sort, filter);
                    const result:any=await findAllTaxRate(params as TaxRateSource);
                    setDataSource(result.data);
                    return result;
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (key, row) => {
                        const result = await saveTaxRate(row as TaxRateSource);
                        row.id = result.data.id;
                    },
                    onDelete: async (key, row) => {
                        console.log(row);
                    },
                    onChange: setEditableRowKeys,
                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                }}
            />
        </PageContainer>
    )
}
export default TaxRate;


