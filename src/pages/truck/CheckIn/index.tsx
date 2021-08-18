import { Button, message, Select, Input, UploadProps } from 'antd';
import type { FormInstance } from 'antd';
import React, { useState, useRef, useContext } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProProvider from '@ant-design/pro-provider';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormGroup } from '@ant-design/pro-form';
import { IdcardTwoTone } from '@ant-design/icons';
import { ExtraData, TruckPlanInfo } from './data';
import {
  queryTruckPlanInfo,
  exportExcel,
  addTruckPlanInfo,
  updateTruckPlanInfo,
  deleteTruckPlanInfo,
  releaseTruck,
  loadIdCardInfo,
  openCardIdDevice,
  closeCardIdDevice
} from './service';
import moment from 'moment';
import OAFileUpload from '@/components/OA/OAFileUpload';
import { UploadActionType, UploadColumn } from '@/components/OA/OAFileUpload/data';

const uploadColumns: UploadColumn[] = [
  { order: 1, key: "driverId", title: "司機身份證", sample: "33078119850907283X" },
  { order: 2, key: "truckNo", title: "車牌", sample: "蘇EAB123" },
  { order: 3, key: "company", title: "公司", sample: "L230" },
  { order: 4, key: "plant", title: "廠別", sample: "F230" },
  { order: 5, key: "deliveryDate", title: "到達日期", sample: "2021-06-07", type: "string" },
  { order: 6, key: "deliveryTime", title: "到達時間", sample: "8:00", type: "string" },
  { order: 7, key: "driver", title: "司機", sample: "張三" },
  { order: 8, key: "forwarder", title: "所屬單位", sample: "昆山XX餐飲經營管理有限公司" },
  { order: 9, key: "reference", title: "事由", sample: "送餐" }
];



const handleExportExcel = async (params?: TruckPlanInfo) => {
  const hide = message.loading('正在请求下载');
  try {
    await exportExcel(params);
    hide();
    message.success('下载中...');
    return true;
  } catch (error) {
    hide();
    message.error('下载失败请重试！');
    return false;
  }
};
/**
 * 添加节点
 *
 * @param fields
 */
const handleAddTruckInfo = async (fields: TruckPlanInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addTruckPlanInfo({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleUpdateTruckInfo = async (fields: TruckPlanInfo) => {
  const hide = message.loading('正在更新');
  try {
    // if (fields.leaveTime as any instanceof Object) {
    //   fields.leaveTime = (fields?.leaveTime as Date).format('YYYY-MM-DD HH:mm:ss');
    // }
    // if (fields.actualDeliveryTime as any instanceof Object) {
    //   fields.actualDeliveryTime = (fields?.actualDeliveryTime as any).format('YYYY-MM-DD HH:mm:ss');
    // }
    const result = await updateTruckPlanInfo(fields);
    hide();
    if (result.errorCode == 0) {
      message.success('更新成功');
      return true;
    } else {
      message.error(`更新失败:${result.errorMessage}`);
      return false;
    }
  } catch (error) {
    hide();
    console.log(error);
    message.error('更新失败请重试', error);
    return false;
  }
};

const handleDeleteTruckInfo = async (fields: TruckPlanInfo) => {
  const hide = message.loading('正在刪除');
  try {
    await deleteTruckPlanInfo(fields);
    hide();
    message.success('刪除成功');
    return true;
  } catch (error) {
    hide();
    console.log(error);
    message.error('更新失败请重试', error);
    return false;
  }
};



/**
 * 放行卡车
 *
 * @param selectedRows
 */
const handleReleaseTruck = async (selectedRows: TruckPlanInfo[], extraData: ExtraData) => {
  const hide = message.loading('正在放行');
  if (!selectedRows) return true;


  extraData.inOrOut = extraData.gateId == "ABA0F1292C" ? "in" : "out";

  console.log("extraData", extraData);
  if (extraData.handCarry != "Y") {
    if (!extraData.gateId || !extraData.inOrOut) {
      hide();
      message.error('非手抱货业务员,请选择闸机编号和进出厂选项');
      return false;
    }
  }

  try {
    const result = await releaseTruck(selectedRows, extraData);
    hide();
    console.log("release result:", result);
    if (result.errorCode == 0) {
      message.success('放行成功，即将刷新');
      return true;
    } else {
      message.error('放行失败.' + result.errorMessage);
      return false;
    }
  } catch (error) {
    hide();
    message.error('放行失败，请重试');
    return false;
  }
};

const extraData: ExtraData = {} as ExtraData;

const CheckIn: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TruckPlanInfo[]>([]);

  //TODO 默認用戶token
  const [referenceId, setReferenceId] = useState<string>("123");


  const uploadActionRef = useRef<UploadActionType>();
  const ref = useRef<UploadProps>();

  const csvData: TruckPlanInfo[] = [];


  /** 国际化配置 */
  const intl = useIntl();

  const columns: ProColumns<TruckPlanInfo>[] = [
    {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.driverId" />,
      dataIndex: 'driverId',
      valueType: 'search',
      width: 170,
      fixed: 'left',
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.truckNo" />,
      dataIndex: 'truckNo',
      width: 100,
      fixed: 'left',
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.company" />,
      dataIndex: 'company',
      width: 50,
      editable: false
    },
    {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.plant" />,
      dataIndex: 'plant',
      width: 50,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.deliveryDate" />,
      dataIndex: 'deliveryDate',
      width: 100,
      valueType: 'date',
      initialValue: moment(new Date()),
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.deliveryTime" />,
      dataIndex: 'deliveryTime',
      width: 80,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.driver" />,
      dataIndex: 'driver',
      width: 70,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.forwarder" />,
      dataIndex: 'forwarder',
      width: 220,
      ellipsis: true,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.reference" />,
      dataIndex: 'reference',
      width: 200,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.logId" />,
      dataIndex: 'logId',
      width: 120,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.log_date" />,
      dataIndex: 'log_date',
      width: 200,
      editable: false
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.actualDeliveryTime" />,
      dataIndex: 'actualDeliveryTime',
      valueType: 'dateTime',
      width: 200,
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.guardId" />,
      dataIndex: 'guardId',
      width: 120,
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.leaveTime" />,
      dataIndex: 'leaveTime',
      valueType: 'dateTime',
      width: 200,
    }, {
      title: <FormattedMessage id="pages.truck.truckPlanInfo.leaveGuardId" />,
      dataIndex: 'leaveGuardId',
      width: 120,
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'option',
      width: 300,
      valueType: 'option',
      render: (_, row, index, action) => [
        <a
          key="id"
          onClick={() => {
            action?.startEditable(row.id);
          }}
        >
          编辑
        </a>,
        <a
          key="id"
          onClick={() => {

          }}
        >
          checkin
        </a>,
        <a
          key="id"
          onClick={() => {
            debugger;
            // ref.current.res
            const result = uploadActionRef.current?.resetReferenceId("123");
            message.success(result);
          }}
        >
          码头分配
        </a>,
        <a
          key="id"
          onClick={() => {

          }}
        >
          arrive
        </a>,
        <a
          key="id"
          onClick={() => {

          }}
        >
          leave
        </a>,



      ],
    },
  ];

  const values = useContext(ProProvider);

  return (
    <PageContainer>
      <ProProvider.Provider
        value={{
          ...values,
          valueTypeMap: {
            search: {
              render: (text) => <>{text}</>,
              renderFormItem: (text, props) => (
                <Input allowClear addonAfter={<IdcardTwoTone
                  onClick={async () => {
                    const hide = message.loading('身份证识别中');
                    await closeCardIdDevice().then(res => console.log("closeCardIdDevice", res));
                    await openCardIdDevice().then(res => console.log("openCardIdDevice", res));
                    await loadIdCardInfo()
                      .then(res => {
                        hide();
                        console.log("loadIdCardInfo", res);
                        if (res) {
                          formRef.current?.setFieldsValue({ driverId: res.certNumber.length > 0 ? res.certNumber : '--' });
                          formRef.current?.submit();
                        }
                      })
                  }} style={{ fontSize: 28 }} />}  {...props?.fieldProps} />
              ),
            },
          },
        }}
      >
        <ProTable<TruckPlanInfo>
          headerTitle={intl.formatMessage({
            id: 'pages.truck.truckPlanInfo.title',
            defaultMessage: '登记表格',
          })}
          pagination={{ pageSize: 10 }}
          actionRef={actionRef}
          formRef={formRef}
          rowKey="id"
          scroll={{ x: 1500 }}
          toolbar={{
            actions: [

              <Select onChange={(value: string) => { extraData.gateId = value as string }} placeholder="请选择闸机编号" style={{ width: 150 }} >
                <Select.Option key="ABA0F1292C" value="ABA0F1292C">北门入口</Select.Option>
                <Select.Option key="1297252911" value="1297252911">北门出口</Select.Option>
              </Select>,
              <Select onChange={(value: string) => { extraData.handCarry = value as string }} placeholder="请选择是否手抱货" style={{ width: 160 }}  >
                <Select.Option value="Y">手抱货</Select.Option>
                <Select.Option value="N">非手抱货</Select.Option>
              </Select>,
              <Button
                key="add"
                type="primary"
                onClick={() => {
                  handleModalVisible(true);
                }}
              >
                信息登记
              </Button>,
              <Button key="add"
                type="primary"
                onClick={() => {
                  handleExportExcel(formRef.current?.getFieldsValue());
                }}>导出</Button>,
              <OAFileUpload
                uploadColumns={uploadColumns}
                showTabs={["normal"]}
                referenceId={referenceId}
                actionRef={uploadActionRef}
                ref={ref}
                mode="button"
                onExcelFinish={{
                  success: async data => {

                    const result = data as TruckPlanInfo[];

                    for (let i = 0; i < result.length; i++) {
                      const truckPlanInfo = result[i];
                      console.log(truckPlanInfo.driverId, truckPlanInfo);
                    }

                    console.log("received result from upload component", data)
                  }
                }} />
            ],
          }}
          request={async (params: TruckPlanInfo) => {
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
          rowSelection={{
            onChange: (_: any, selectedRows: React.SetStateAction<TruckPlanInfo[]>) => {
              setSelectedRows(selectedRows);
            },
          }}
          editable={{
            onSave: async (key, row, originRow) => {
              console.log("saved row", row);
              await handleUpdateTruckInfo({ ...originRow, ...row });
            },
            onDelete: async (key, row) => {
              console.log("delete row", row);
              await handleDeleteTruckInfo(row);
            }
          }

          }
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              </div>
            }
          >
            <Button type="primary"
              onClick={async () => {
                console.log("gateId", extraData.gateId);
                console.log("inOrOut", extraData.inOrOut);
                console.log("handCarry", extraData.handCarry);

                const success = await handleReleaseTruck(selectedRowsState, extraData);
                if (success) {
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                }
              }}>
              <FormattedMessage id="pages.truck.batchApproval" defaultMessage="批量放行" />
            </Button>
          </FooterToolbar>
        )}
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.truck.truckPlanInfo.registry',
            defaultMessage: '注册司机',
          })}
          width="800px"
          visible={createModalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async (value: TruckPlanInfo) => {
            const success = await handleAddTruckInfo(value as TruckPlanInfo);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <ProFormGroup>
            {columns.map((item, index) => {
              return <ProFormText key={index} name={item.dataIndex} label={item.title} />
            })}
          </ProFormGroup>
        </ModalForm>
      </ProProvider.Provider>

    </PageContainer>
  );
};

export default CheckIn;
