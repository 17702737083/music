import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import * as xlsx from 'xlsx';
import { useModel } from 'umi';
import { downTemplateCostDelegationAuth, findAllCostDelegationAuth, saveAllCostDelegationAuth, saveCostDelegationAuth } from './service';
import { Button, message, Upload } from 'antd';
import { CostDelegationAuthSource, OptionsData } from '../../data';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { getUserAuth } from '../../ruleBaseData/service';
import { hintCostAbout } from '../CostAccountantCourse/service';



//费用类别-会计科目

const CostDelegationAuth: React.FC = () => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<CostDelegationAuthSource[]>([]);
    const [companList, setCompanList] = useState<OptionsData[]>([]);//拥有的权限厂别
    const [company, setCompany] = useState('');//拥有的权限厂别
    const [position, setPosition] = useState<'top' | 'bottom' | 'hidden'>('bottom');
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const actionRef = useRef();
    const { initialState } = useModel("@@initialState");

    useEffect(async () => {
        initCompanList();
        console.log(initialState?.currentUser?.employeeInfoDTO?.emplid);
        const reslult = await findAllCostDelegationAuth(initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '', {} as CostDelegationAuthSource);
        console.log(reslult, "reslult");
        if (reslult.code == 200) {
            setDataSource(reslult.data);
        } else {
            message.error(reslult.message);
        }
    }, [])
    const initCompanList = async () => {
        const res = await getUserAuth(initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
        console.log(res, "res");
        if (res.code == 200) {
            let companylist: OptionsData[] = [];
            res.data.forEach((item: string) => {
                console.log(item, "item");
                const tempDetail: OptionsData = { label: '', value: '', };
                tempDetail.label = item;
                tempDetail.value = item;
                companylist.push(tempDetail);
            });
            setCompanList(companylist);
        } else {
            message.error("您没有维护该基础资料的权限！！");
        }
    }
    useEffect(() => {

    }, [dataSource])


    const uploadprops = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: (file: Blob, fileList: any) => {
            if (company == null || company == '' || company == undefined) {
                message.error("请选择您要维护的基础资料所属公司别");
                return;
            }
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
                    const result = await saveAllCostDelegationAuth(company, data2 as CostDelegationAuthSource[]);
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

    const columns: ProColumns<CostDelegationAuthSource>[] = [
        {
            title: '公司别',
            dataIndex: 'companyCode',
            width: 120,
            ellipsis: true,
        },
        {
            title: '費用類別',
            dataIndex: 'costAlias',
            width: 120,
            ellipsis: true,
        },
        {
            title: '費用項目',
            dataIndex: 'costProject',
            width: 120,
            ellipsis: true,
        },
        {
            title: '核决权限代码',
            dataIndex: 'permissionCode',
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
            // fixed: 'right',
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
        downTemplateCostDelegationAuth("CostDelegationAuth");
    }
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ['序号', "公司别", "費用類別", "費用項目", "核决权限代码", '是否有效']
        ]
        console.log(dataSource);
        dataSource.forEach((item: any, index: number) => {
            console.log(item);
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.companyCode ? item.companyCode : ''}`,
                `${item.costAlias ? item.costAlias : ''}`,
                `${item.costProject ? item.costProject : ''}`,
                `${item.permissionCode ? item.permissionCode : ''}`,
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
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, '费用类别-核决权限.xlsx')
    }
    return (
        <PageContainer>
            <ProTable<CostDelegationAuthSource>
                rowKey="id"
                actionRef={actionRef}
                scroll={{ x: 1000 }}
                toolBarRender={() => [
                    <ProFormSelect
                        width="sm"
                        fieldProps={{
                            // defalutValue: companList[0],
                            labelInValue: true,
                            onChange: (e) => {
                                setCompany(e.value);
                            }
                        }}
                        valueEnum={() => {
                            const options = {};
                            companList.forEach((item: any) => {
                                options[item.value] = item.label
                            });
                            return options;
                        }}
                        name="companyCode"
                        label="公司别"
                        placeholder='请选择公司别'
                    // style={{marginTop:25}}
                    />,
                    <div style={{ marginBottom: 25 }}>
                        <ModalForm<CostDelegationAuthSource>
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
                                const result = await saveCostDelegationAuth(values as CostDelegationAuthSource);
                                if (result.code == 200) {
                                    message.success('提交成功');
                                    (actionRef.current as any).reload();
                                    const resu= await hintCostAbout(values.companyCode as string ,values.costAlias as string ,values.costProject as string );
                                    if(resu.code==200){
                                        message.success( resu.message,
                                          );
                                    }else{
                                        message.info( resu.message);
                                    }
                                    return true;
                                }
                            }}
                        >
                            <ProForm.Group>
                                <ProFormText width="sm" name="companyCode" label="公司别" />
                                <ProFormText
                                    width="sm"
                                    name="costAlias"
                                    label="費用類別"
                                />
                                <ProFormText width="sm" name="costProject" label="費用項目" />
                                <ProFormText width="sm" name="permissionCode" label="核决权限代码" />

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
                        </ModalForm>
                        <Upload {...uploadprops} style={{ marginLeft: 2 }}>
                            <Button type="ghost" >
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                        <Button type="primary" onClick={downloadtemplate} style={{ marginLeft: 2 }}>
                            上传模板
                        </Button>
                        <Button type="primary" onClick={downloadData} style={{ marginLeft: 2 }}>
                            下载
                        </Button>
                    </div>
                ]}
                pagination={{ defaultPageSize: 6 }}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                    console.log(params, "params");
                    console.log(sort, filter);
                    const result: any =await findAllCostDelegationAuth(initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '', params as CostDelegationAuthSource);
                    console.log(result.data,"result.data");
                    setDataSource(result.data);
                    return result;
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (key, row) => {
                        const result = await saveCostDelegationAuth(row as CostDelegationAuthSource);
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
export default CostDelegationAuth;


