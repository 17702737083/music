import React, { useEffect, useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal, Table } from 'antd';
import * as xlsx from 'xlsx';
import { findAllEstimateApportionMain } from './service';
import { EstimateApportionMainSource } from '../data';
import { useModel } from 'umi';
import { saveAllArea, saveArea } from '../epaBaseData/Area/service';
// import { useModel } from 'umi';


type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};


//預估單查詢

const EstimateApportionList: React.FC = () => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

    const [cashList, setCashList] = useState([]);
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const actionRef = useRef();
    const { initialState } = useModel("@@initialState");

    useEffect(async () => {
        console.log(initialState?.currentUser?.employeeInfoDTO?.deptid);
        const params = { departmentId: initialState?.currentUser?.employeeInfoDTO?.deptid, state:'closed'};
        const reslult = await findAllEstimateApportionMain(params as EstimateApportionMainSource);
        console.log(reslult, "reslult");
        if (reslult.code == 200) {
            setDataSource(reslult.data);
        } else {
            message.info("您部门还未有可查询预估单！！");
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
                    const result = await saveAllArea("",data2 as EstimateApportionMainSource[]);
                    if (result.code == 200) {
                        message.success("上传成功");
                        (actionRef.current as any).reload();
                    } else {
                        message.info(res.message);
                    }
                } else {
                    message.error("上传的数据为空");
                }
            }
            fileReader.readAsBinaryString(file);
        },
    };
    const columnCash = [
        {
            title: '请款单号',
            dataIndex: 'formId',
            ellipsis: true,
        },
        {
            title: '使用金额',
            dataIndex: 'money',
            ellipsis: true,
            search: false,
        },
    ];
    const columns: ProColumns<EstimateApportionMainSource>[] = [
        {
            title: '预估单号',
            dataIndex: 'formId',
            width: 120,
            ellipsis: true,
        },
        {
            title: '申请部门',
            dataIndex: 'departmentId',
            width: 200,
            ellipsis: true,
            search: false,
        },
        {
            title: '申请人',
            dataIndex: 'cruser',
            width: 120,
            ellipsis: true,
        },
        {
            title: '费用类别',
            dataIndex: 'costAlias',
            width: 120,
            ellipsis: true,
        },
        {
            title: '费用项目',
            dataIndex: 'costProject',
            width: 200,
            ellipsis: true,
        },
        {
            title: '预估金额',
            dataIndex: 'totalMoney',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '使用金额',
            width: 120,
            search: false,
            render: (text, record, index) => {
                const value = Number(record.totalMoney) - Number(record.balance);
                return <a type="link" onClick={() => {
                    console.log(record.formId);
                    //根据预估单号到后台查询使用 此预估单的冲销单
                    setCashList([{ formId: "001", money: 200 }]);
                    showModal();
                }}>{value}</a>
            }
        },
        {
            title: '剩余金额',
            dataIndex: 'balance',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '状态',
            dataIndex: 'state',
            valueType: 'select',
            valueEnum: {
                all: { text: '全部' },
                closed: {
                    text: '已入账',
                },
                close: {
                    text: '已close',
                },
            },
        },
    ];
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ["序号", "区域代码", "区域名称", "区域别", "是否有效"]
        ]
        console.log(dataSource);
        dataSource.forEach((item: any, index: number) => {
            console.log(item);
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.areaCode}`,
                `${item.areaName ? item.areaName : ''}`,
                `${item.areaType ? item.areaType : ''}`,
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
        xlsx.writeFile(wb, 'Area.xlsx')
    }
    return (
        <PageContainer>
            <ProTable<EstimateApportionMainSource>
                rowKey="id"
                actionRef={actionRef}
                pagination={{ defaultPageSize: 6 }}
                columns={columns}
                request={async (params = {}, sort, filter) => {
                    if(params.state==''||params.state==undefined){
                        params.state='closed';
                    }
                    // , state:'closed'
                    params.departmentId = initialState?.currentUser?.employeeInfoDTO?.deptid;
                    return findAllEstimateApportionMain(params as EstimateApportionMainSource);
                }}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (key, row) => {
                        const result = await saveArea(row as EstimateApportionMainSource);
                        row.id = result.data.id;
                    },
                    onDelete: async (key, row) => {
                        console.log(row);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
            <Modal title="使用详情" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Table columns={columnCash} dataSource={cashList} />
            </Modal>
        </PageContainer>

    )
}
export default EstimateApportionList;


