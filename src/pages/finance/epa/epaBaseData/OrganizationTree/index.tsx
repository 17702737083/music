import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import * as xlsx from 'xlsx';
import { useModel } from 'umi';
import { downTemplateOrganizationTree, findAllOrganizationTree, saveAllOrganizationTree, saveOrganizationTree } from './service';
import { Button, message, Upload } from 'antd';
import { OrganizationTreeSource } from '../../data';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import Icon, { PlusOutlined } from '@ant-design/icons';



//组织树

const OrganizationTree: React.FC = () => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<OrganizationTreeSource[]>([]);
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const actionRef = useRef();
    const { initialState } = useModel("@@initialState");

    useEffect(async () => {
        console.log(initialState?.currentUser?.employeeInfoDTO?.emplid);
        const reslult = await findAllOrganizationTree({} as OrganizationTreeSource);
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
                    const result = await saveAllOrganizationTree(data2 as OrganizationTreeSource[]);
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

    const columns: ProColumns<OrganizationTreeSource>[] = [
        {
            title: '公司',
            dataIndex: 'companyName',
            width: 300,
            ellipsis: true,
        },
        {
            title: '部門',
            dataIndex: 'departmentId',
            width: 120,
            ellipsis: true,
        },
        {
            title: '公司别',
            dataIndex: 'companyCode',
            width: 120,
            ellipsis: true,
        },
        {
            title: '地区',
            dataIndex: 'siteDescription',
            width: 120,
            ellipsis: true,
        },
        {
            title: '生效日期',
            dataIndex: 'effectiveDate',
            width: 120,
            ellipsis: true,
        },
        {
            title: '部门层级',
            dataIndex: 'tier',
            width: 100,
            ellipsis: true,
        },
        {
            title: '上层组织',
            dataIndex: 'superstratumGroup',
            width: 120,
            ellipsis: true,
        },
        {
            title: '部門名稱(中)',
            dataIndex: 'groupName',
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
        downTemplateOrganizationTree("OrganizationTree");
    }
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ['序号', "公司", "部門", "公司别", "地区",
                "生效日期", "部门层级", "上层组织", "部門名稱(中)", '是否有效']
        ]
        console.log(dataSource);
        dataSource.forEach((item: any, index: number) => {
            console.log(item);
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.companyName ? item.companyName : ''}`,
                `${item.departmentId ? item.departmentId : ''}`,
                `${item.companyCode ? item.companyCode : ''}`,
                `${item.siteDescription ? item.siteDescription : ''}`,
                `${item.effectiveDate ? item.effectiveDate : ''}`,
                `${item.tier ? item.tier : ''}`,
                `${item.superstratumGroup ? item.superstratumGroup : ''}`,
                `${item.groupName ? item.groupName : ''}`,
                `${item.flag}`,
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
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, '组织树.xlsx')
    }
    return (
        <PageContainer>
            <ProTable<OrganizationTreeSource>
                rowKey="id"
                actionRef={actionRef}
                scroll={{ x: 1000 }}
                toolBarRender={() => [
                    <ModalForm<OrganizationTreeSource>
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
                            const result = await saveOrganizationTree(values as OrganizationTreeSource);
                            if (result.code == 200) {
                                message.success('提交成功');
                                (actionRef.current as any).reload();
                                return true;
                            }
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="sm"
                                name="companyName"
                                label="公司"
                            />
                            <ProFormText width="sm" name="departmentId" label="部門" />
                            <ProFormText width="sm" name="OrganizationTreeName" label="客户名称" />
                            <ProFormText width="sm" name="companyCode" label="公司别" />
                            <ProFormText width="sm" name="siteDescription" label="地区" />
                            <ProFormText width="sm" name="effectiveDate" label="生效日期" />
                            <ProFormText width="sm" name="tier" label="部门层级" />
                            <ProFormText width="sm" name="superstratumGroup" label="上层组织" />
                            <ProFormText width="sm" name="groupName" label="部門名稱(中)" />
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
                    const result:any=await findAllOrganizationTree(params as OrganizationTreeSource);
                    setDataSource(result.data);
                    return result;
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (key, row) => {
                        const result = await saveOrganizationTree(row as OrganizationTreeSource);
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
export default OrganizationTree;


