import type { TruckUrgentInfo } from './data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useRef,useState } from 'react';
import type { FormInstance, UploadProps } from 'antd';
import {Button} from 'antd';
import { message, Popconfirm } from 'antd';
import OAFileUpload from '@/components/OA/OAFileUpload';
import { UploadActionType, UploadColumn } from '@/components/OA/OAFileUpload/data';
import { OAFileUploadProps } from '@/components/OA/OAFileUpload/data';
import { ModalForm } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl, FormattedMessage } from 'umi';
import {
    queryTruckPlanInfo,
    deleteTruckUrgent,
    uploadInDB
} from './service';

const uploadColumns: UploadColumn[] = [
    { order: 1, key: "plant", title: "厂别", sample: "F230" },
    { order: 2, key: "urgentDate", title: "急料日期", sample: "20210505" },
    { order: 3, key: "urgentTime", title: "时间", sample: "800" },
    { order: 4, key: "fowder", title: "货代", sample: "" },
    { order: 5, key: "truckNo", title: "车牌", sample: "" },
    { order: 6, key: "mobile", title: "手机号", sample: "" },
    { order: 7, key: "importNo", title: "进口号", sample: "" },
    { order: 8, key: "hwbn", title: "运单号", sample: "" },
    { order: 9, key: "vendor", title: "销售公司", sample: "629213" },
    { order: 10, key: "mc", title: "物料管控", sample: "" },
    { order: 11, key: "buyer", title: "采购", sample: "Songfang" },
    { order: 12, key: "partNo", title: "料号", sample: "150.05W06.0001" },
    { order: 13, key: "description", title: "料号描述", sample: "" },
    { order: 14, key: "buyerConfirm", title: "采购确认", sample: "eta 5/4" },
    { order: 15, key: "qty", title: "数量", sample: "1760" },
    { order: 16, key: "po", title: "订单", sample: "" },
    { order: 17, key: "poLine", title: "订单流水号", sample: "" },
    { order: 18, key: "remark", title: "备注", sample: "" },
];
  
const handleDeleteTruckUrgent = async (fields: TruckUrgentInfo) => {
    const hide = message.loading('正在刪除');
    try {
      await deleteTruckUrgent(fields);
      hide();
      message.success('刪除成功');
      return true;
    } catch (error) {
      hide();
      console.log(error);
        message.error('刪除失败请重试', error);
      return false;
    }
};

const Truckurgent: React.FC<OAFileUploadProps> = (props) => {

    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const formRef = useRef<FormInstance>();
    const actionRef = useRef<ActionType>();
    const [referenceId, setReferenceId] = useState<string>("123");
    const uploadActionRef = useRef<UploadActionType>();
    const ref = useRef<UploadProps>();

    const [dataSource, setDataSource] = useState<any[]>([]);
    const [flag, setFlag] = useState<any[]>([]);

    const intl = useIntl();
    const columns: ProColumns<TruckUrgentInfo>[] = [
        { 
            title: <FormattedMessage id="pages.truck.urgent.id" />,
            dataIndex: "id",
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.plant" />,
            dataIndex:'plant',
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.urgentDate" />,
            dataIndex:'urgentDate',
            valueType: 'date',
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.time" />,
            dataIndex: 'urgentTime',
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.fowder" />,
            dataIndex: 'fowder'
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.truckNo" />,
            dataIndex: 'truckNo',
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.mobile" />,
            dataIndex: 'mobile',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.importNo" />,
            dataIndex: 'importNo'
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.hwbn" />,
            dataIndex: 'hwbn',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.vendor" />,
            dataIndex: 'vendor',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.mc" />,
            dataIndex: 'mc',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.buyer" />,
            dataIndex: 'buyer',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.partNo" />,
            dataIndex: 'partNo',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.description" />,
            dataIndex: 'description',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.buyerConfirm" />,
            dataIndex: 'buyerConfirm',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.qty" />,
            dataIndex: 'qty',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.po" />,
            dataIndex: 'po',
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.poLine" />,
            dataIndex: 'poLine'
        },
        {
            title: <FormattedMessage id="pages.truck.urgent.remark" />,
            dataIndex: 'remark'
        },
        { 
            title: <FormattedMessage id="pages.truck.urgent.operation" />,
            fixed: 'right',
            width: 150,
            valueType: 'option',
            render: (_, row, index,action) => [
                // <a key="id"
                // onClick={()=>{
                //     handleDeleteTruckUrgent(row)}}>刪除</any>
                    <Popconfirm
                    title="確定刪除?"
                    onConfirm={() => {
                         const result = handleDeleteTruckUrgent(row);
                    }}
                    okText="Yes"
                    cancelText="No"
                    >
                    {!props.readonly && <a key={index}>删除</a>}
                </Popconfirm>
            ]
        }

    ];

    return(
        <PageContainer>
            <ProTable<TruckUrgentInfo>
                headerTitle={intl.formatMessage({
                    id: 'pages.truck.truckPlanInfo.title',
                    defaultMessage: '登记表格',
                })}
                pagination={{ pageSize: 10 }}
                actionRef={actionRef}
                formRef={formRef}
                rowKey="id"
                scroll={{ x: 'max-content' }}

                toolBarRender={() => [
                    <ModalForm
                        title="上传文件"
                        trigger={
                            <Button type="primary">
                                <PlusOutlined />
                                上传文件
                            </Button>
                        }
                        width={0.7 * window.innerWidth}
                        onVisibleChange={() => {
                            setDataSource(flag);
                        }}
                        onFinish={async () => {
                            if (dataSource == flag || dataSource == []) {
                                message.error('文件为空');
                                return false;
                            }
                            const hide = message.loading('正在提交');
                            try {
                                await uploadInDB(dataSource);
                                hide();
                                message.success('提交成功');
                                setDataSource([]);
                                return true;
                            } catch (error) {
                                hide();
                                console.log(error);
                                message.error('提交失败请重试', error);
                                return false;
                            }

                        }}
                    >
                        <OAFileUpload
                            uploadColumns={uploadColumns}
                            showTabs={["excel"]}
                            referenceId={referenceId}
                            actionRef={uploadActionRef}
                            ref={ref}
                            onExcelFinish={{
                                success: async data => {
                                    setDataSource(data as TruckUrgentInfo[]);
                                    console.log("received result from upload component", data)
                                },
                                fail: async error => {
                                    setDataSource(flag);
                                    console.log("error", error)
                                }
                              }}
                        />

                    </ModalForm>

                  ]}

               request={async (params: TruckUrgentInfo) => {
                const res = await queryTruckPlanInfo(params);
                // csvData = res.data;
                console.log("res", res);
                return {
                  data: res.data?.content,
                  total: res?.data?.totalElements,
                  success: res.errorCode === 0,
                };
              }}
               columns={columns} 
            />

        </PageContainer>
    )
}

export default Truckurgent;