import type { TruckPlanUploadInfo, TruckPlanUploadParams } from './data';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useRef, useState, useMemo } from 'react';
import type { FormInstance } from 'antd';
import { Button, TimePicker } from 'antd';
import { message } from 'antd';
import OAFileUpload from '@/components/OA/OAFileUpload';
import { UploadActionType, UploadColumn } from '@/components/OA/OAFileUpload/data';
import { ModalForm } from '@ant-design/pro-form';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { queryTruckPlanInfo, uploadInDB } from './service';
const TruckPlanUpload: React.FC<{}> = (props) => {
  const intl = useIntl();
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [referenceId, setReferenceId] = useState<string>('123');
  const uploadActionRef = useRef<UploadActionType>();

  const [dataSource, setDataSource] = useState<any[]>([]);
  const columns: ProColumns<TruckPlanUploadInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.driverId',
        defaultMessage: '司机身份证',
      }),
      dataIndex: 'driverId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.truckNo',
        defaultMessage: '车牌',
      }),
      dataIndex: 'truckNo',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.truckPlanType',
        defaultMessage: '计划类型',
      }),
      dataIndex: 'truckPlanType',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.company',
        defaultMessage: '公司',
      }),
      dataIndex: 'company',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.plant',
        defaultMessage: '厂别',
      }),
      dataIndex: 'plant',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.date',
        defaultMessage: '到达日期',
      }),
      dataIndex: 'deliveryDate',
      valueType: 'date',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.deliveryTime',
        defaultMessage: '到达时间',
      }),
      dataIndex: 'deliveryTime',
      render: (text) => <>{text}</>,
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        console.log(rest);
        return (
          // value 和 onchange 会通过 form 自动注入。
          <TimePicker {...rest} format={'HH:mm'} />
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.driver',
        defaultMessage: '司机',
      }),
      dataIndex: 'driver',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.forwarder',
        defaultMessage: '所属单位',
      }),
      dataIndex: 'forwarder',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.reference',
        defaultMessage: '事由',
      }),
      dataIndex: 'reference',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.actualDeliveryTime',
        defaultMessage: '入厂时间',
      }),
      dataIndex: 'actualDeliveryTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.guardId',
        defaultMessage: '放行警卫',
      }),
      dataIndex: 'guardId',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.leaveTime',
        defaultMessage: '出厂时间',
      }),
      dataIndex: 'leaveTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.truck.truckPlanUpload.leaveGuardId',
        defaultMessage: '放行警卫',
      }),
      dataIndex: 'leaveGuardId',
    },
  ];
  const uploadColumns: UploadColumn[] = useMemo(() => {
    return [
      {
        order: 1,
        key: 'driverId',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.driverId',
          defaultMessage: '司机身份证',
        }),
        sample: '33078119850907283X',
      },
      {
        order: 2,
        key: 'truckNo',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.truckNo',
          defaultMessage: '车牌',
        }),
        sample: '浙A019YM',
      },
      {
        order: 3,
        key: 'truckPlanType',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.truckPlanType',
          defaultMessage: '计划类型',
        }),
        sample: '1',
      },
      {
        order: 4,
        key: 'company',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.company',
          defaultMessage: '公司',
        }),
        sample: 'L230',
      },
      {
        order: 5,
        key: 'plant',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.plant',
          defaultMessage: '厂别',
        }),
        sample: 'F230',
      },
      {
        order: 6,
        key: 'deliveryDate',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.deliveryDate',
          defaultMessage: '到达日期',
        }),
        sample: '2021-06-07',
      },
      {
        order: 7,
        key: 'deliveryTime',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.deliveryTime',
          defaultMessage: '到达时间',
        }),
        sample: '08:00',
      },
      {
        order: 8,
        key: 'driver',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.driver',
          defaultMessage: '司机',
        }),
        sample: '张三',
      },
      {
        order: 9,
        key: 'forwarder',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.forwarder',
          defaultMessage: '所属单位',
        }),
        sample: '昆山XX餐飲經營管理有限公司',
      },
      {
        order: 10,
        key: 'reference',
        title: intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.reference',
          defaultMessage: '事由',
        }),
        sample: '送餐',
      },
    ];
  }, []);
  return (
    <PageContainer>
      <ProTable<TruckPlanUploadInfo>
        headerTitle={intl.formatMessage({
          id: 'pages.truck.truckPlanUpload.title',
          defaultMessage: '预约登记',
        })}
        pagination={{ pageSize: 10 }}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <ModalForm
            title={intl.formatMessage({
              id: 'pages.truck.truckPlanUpload.uploadFile',
              defaultMessage: '上传文件',
            })}
            trigger={
              <Button type="primary">
                <PlusOutlined />
                {intl.formatMessage({
                  id: 'pages.truck.truckPlanUpload.uploadFile',
                  defaultMessage: '上传文件',
                })}
              </Button>
            }
            width={0.7 * window.innerWidth}
            onVisibleChange={() => {
              setDataSource([]);
            }}
            onFinish={async () => {
              if (!dataSource.length) {
                message.error('文件为空');
                return false;
              }
              try {
                //时间数据格式转换
                dataSource.forEach((item) => {
                  let deliveryDate = moment(item.deliveryDate).format('YYYY-MM-DD');
                  let deliveryTime = moment(item.deliveryTime, 'Hmm').format('HH:mm');
                  item.deliveryDate = deliveryDate;
                  item.deliveryTime = deliveryTime;
                });
                let result = await uploadInDB(dataSource);
                console.log(result);
                if (!result.errorMessage) {
                  message.success('提交成功');
                  setDataSource([]);
                  actionRef.current?.reloadAndRest();
                  return true;
                } else {
                  message.error(`提交失败请重试:${result.errorMessage}`);
                  return false;
                }
              } catch (error) {
                console.log(error);
                message.error(`提交失败请重试:${error}`);
                return false;
              }
            }}
            modalProps={{
              okText: intl.formatMessage({
                id: 'pages.truck.truckPlanUpload.okText',
                defaultMessage: '提交',
              }),
            }}
          >
            <OAFileUpload
              uploadColumns={uploadColumns}
              showTabs={['excel']}
              mode="tab"
              referenceId={referenceId}
              actionRef={uploadActionRef}
              onExcelFinish={{
                success: async (data) => {
                  setDataSource(data as TruckPlanUploadInfo[]);
                  console.log('received result from upload component', data);
                },
                fail: async (error) => {
                  setDataSource([]);
                  console.log('error', error);
                },
              }}
            />
          </ModalForm>,
        ]}
        request={async (params: TruckPlanUploadParams, sort, filter) => {
          const res = await queryTruckPlanInfo(params);
          // csvData = res.data;
          console.log('res', res);
          return {
            data: res.data?.content,
            total: res?.data?.totalElements,
            success: res.errorCode === 0,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TruckPlanUpload;
