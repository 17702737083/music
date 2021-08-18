import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { DelegationAuthSource } from '../../data';
import { Button, message, Upload } from 'antd';
import Icon, { PlusOutlined } from '@ant-design/icons';
import * as xlsx from 'xlsx';
import { useModel } from 'umi';
import { baseDownloadTemplateDelegationAuth, findAllDelegationAuth, saveAllDelegationAuth, saveDelegationAuth } from './service';


type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};


//公司别-费用类别-费用项目-必填栏位

const DelegationAuth: React.FC = () => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const actionRef = useRef();
    const { initialState } = useModel("@@initialState");

    useEffect(async () => {
        console.log(initialState?.currentUser?.employeeInfoDTO?.emplid);
        const reslult = await findAllDelegationAuth({} as DelegationAuthSource);
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
                    const result = await saveAllDelegationAuth(data2 as DelegationAuthSource[]);
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

    const columns: ProColumns<DelegationAuthSource>[] = [
        {
            title: '核決權限類別',
            dataIndex: 'permissionCode',
            width: 120,
            ellipsis: true,
        },
        {
            title: '幣別',
            dataIndex: 'currency',
            width: 120,
            ellipsis: true,
        },
        {
            title: '董事長暨策略長',
            dataIndex: 'chairman',
            width: 170,
            ellipsis: true,
        },
        {
            title: '副董事長/總經理/執行長',
            dataIndex: 'vicePresident',
            width: 170,
            ellipsis: true,
        },
        {
            title: 'Corp. Func./事業群最高主管',
            dataIndex: 'topSupervisor',
            width: 170,
            ellipsis: true,
        },
        {
            title: '事業處/Corp.Func.II主管',
            dataIndex: 'causeSupervisor',
            width: 170,
            ellipsis: true,
        },
        {
            title: '事業部/BG功能/產品中心/製造廠區主管',
            dataIndex: 'factorySupervisor',
            width: 170,
            ellipsis: true,
        },
        {
            title: '處級/廠級主管',
            dataIndex: 'leaderSupervisor',
            width: 170,
            ellipsis: true,
        },
        {
            title: '是否有效',
            dataIndex: 'flag',
            valueType: 'select',
            width: 120,
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
            width: 100,
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
            width: 100,
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
        //         <a
        //             key="delete"
        //             onClick={() => {
        //                 setDataSource(dataSource.filter((item) => item.id !== record.id));
        //             }}
        //         >
        //             删除
        //   </a>,
            ],
        },
    ];

    const downloadtemplate = () => {
        baseDownloadTemplateDelegationAuth("DelegationAuth");
    }
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ["序号", "核決權限類別", "幣別", "董事長暨策略長", "副董事長/總經理/執行長",
                "Corp. Func./事業群最高主管", "事業處/Corp.Func.II主管",
                "事業部/BG功能/產品中心/製造廠區主管", "處級/廠級主管", "是否有效"]
        ]
        console.log(dataSource);
        dataSource.forEach((item: any, index: number) => {
            console.log(item);
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.permissionCode ? item.permissionCode : ''}`,
                `${item.currency ? item.currency : ''}`,
                `${item.chairman ? item.chairman : ''}`,
                `${item.vicePresident ? item.vicePresident : ''}`,
                `${item.topSupervisor ? item.topSupervisor : ''}`,
                `${item.causeSupervisor ? item.causeSupervisor : ''}`,
                `${item.factorySupervisor ? item.factorySupervisor : ''}`,
                `${item.leaderSupervisor ? item.leaderSupervisor : ''}`,
                `${item.flag ? item.flag : ''}`,
            ];
        })
        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            { wch: 10 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, '核决权限.xlsx')
    }
    return (
        <PageContainer>
            <ProTable<DelegationAuthSource>
                rowKey="id"
                actionRef={actionRef}
                scroll={{ x: 1000 }}
                // buttonText="Download as XLS"
                toolBarRender={() => [
                    <ModalForm<DelegationAuthSource>
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
                            const result = await saveDelegationAuth(values as DelegationAuthSource);
                            if (result.code == 200) {
                                message.success('提交成功');
                                (actionRef.current as any).reload();
                                return true;
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText width="sm" name="permissionCode" label="核決權限類別" />
                            <ProFormText width="sm" name="currency" label="幣別" />
                            <ProFormText width="sm" name="chairman" label="董事長暨策略長" />
                            <ProFormText width="sm" name="vicePresident" label="副董事長/總經理/執行長" />
                            <ProFormText width="sm" name="topSupervisor" label="Corp. Func./事業群最高主管" />
                            <ProFormText width="sm" name="causeSupervisor" label="事業處/Corp.Func.II主管" />
                            <ProFormText width="sm" name="factorySupervisor" label="事業部/BG功能/產品中心/製造廠區主管" />
                            <ProFormText width="sm" name="leaderSupervisor" label="處級/廠級主管" />
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
                    const result: any =await  findAllDelegationAuth(params as DelegationAuthSource);
                    setDataSource(result.data);
                    return result;
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (key, row) => {
                        const result = await saveDelegationAuth(row as DelegationAuthSource);
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
export default DelegationAuth;


