
import { Button, message, Modal, Select } from 'antd';
import type { FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data';
import NetUtil from './NetUtil';

import { CSVLink, CSVDownload } from 'react-csv';
import {
  dynamicquery,
  releaseXuqian,
  releaseqiancheng,
  exportXuqian,
  releaseqiancheng1

} from './service';
import UploadModal from '@/components/UploadModal';
import { FileExcelOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

/**
 * 发起e签宝签署
 *
 * @param selectedRows
 */
const releaseqianchengs1 = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在发起签呈~');
  if (!selectedRows) return true;
  try {
    await releaseqiancheng1(selectedRows);
    hide();

    message.success('发起签呈成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.success('发起签呈成功，即将刷新');
    return true;
  }
};
const releaseqianchengs = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在发起签呈~');
  if (!selectedRows) return true;
  try {
    await releaseqiancheng(selectedRows);
    hide();

    message.success('发起签呈成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.success('发起签呈成功，即将刷新');
    return true;
  }
};
const handleRelease = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在发起续签~');
  if (!selectedRows) return true;
  try {
    await releaseXuqian(selectedRows);
    hide();

    message.success('发起续签成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.success('发起续签成功，即将刷新');
    return true;
  }
};
// const dynamicquery1 = async (params?: TableListItem) => {
//   const hide = message.loading('正在查询');
//   try {
//     await dynamicquery(params);
//     hide();
//     message.success('查询完毕!');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('查询失败请重试！');
//     return false;
//   }
// };



const exportXuqiann = async (params?: TableListItem) => {
  console.log("ooo", params);

  const hide = message.loading('正在请求下载');
  try {
    await exportXuqian(params);
    hide();
    message.success('下载中...');
    return true;
  } catch (error) {
    hide();
    message.error('下载失败请重试！');
    return false;
  }
};
const EContractReport: React.FC = () => {
  // let dd=[];
  const [data, setData] = useState([]);
  const dynamicquery1 = async (params?: TableListItem) => {
    const hide = message.loading('正在查询');
    try {

      hide();
      message.success('查询完毕!');
      dynamicquery(params).then((result) => {
        // console.log("resultresult", result.data);
        //  dd=result.data;
        setData(result.data)
        // console.log("dd:",dd);

      })
      return await dynamicquery(params);
    } catch (error) {
      hide();
      message.error('查询失败请重试！');
      return false;
    }
  };

  const intl = useIntl();
  const headers = [
    { label: intl.formatMessage({ id: "menu.hr.reNew.name" }), key: "cname" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.deptid" }), key: "deptid" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.emplid" }), key: "emplid" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.emplCategory" }), key: "emplCategory" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.hdate" }), key: "hdate" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.nofix" }), key: "nofix" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.nofixgreen" }), key: "nofixgreen" },
    { label: intl.formatMessage({ id: "menu.hr.reNew.fixgreen" }), key: "fixgreen" }, { label: intl.formatMessage({ id: "menu.hr.reNew.signtype" }), key: "signtype" }, { label: intl.formatMessage({ id: "menu.hr.reNew.sdate" }), key: "sdate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.edate" }), key: "edate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.phone" }), key: "phone" }, { label: intl.formatMessage({ id: "menu.hr.reNew.cuser" }), key: "cuser" }, { label: intl.formatMessage({ id: "menu.hr.reNew.cdate" }), key: "cdate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.headcrtdate" }), key: "headcrtdate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.rejectdate" }), key: "rejectdate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.approvedate" }), key: "approvedate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.senddate" }), key: "senddate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.signdate" }), key: "signdate" }, { label: intl.formatMessage({ id: "menu.hr.reNew.finishdate" }), key: "finishdate" },
  ];
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'cname',
    },
    {
      title: '部门',
      dataIndex: 'deptid',
    },
    {
      title: '工号',
      dataIndex: 'emplid',
    },
    {
      title: '人员类别',
      dataIndex: 'emplCategory',
      filters: true,
      onFilter: true,
      valueEnum: {
        DL: { text: 'DL' },
        IDL: { text: 'IDL' },
      },
    },
    {
      title: '入职日期',
      dataIndex: 'hdate',
      valueType: 'date',
    },
    {
      title: '符合无固定期限',
      dataIndex: 'nofix',

    },
    {
      title: '个人是否愿意签订无固定期限',
      dataIndex: 'nofixgreen',

    },
    {
      title: '个人是否愿意签订固定期限',
      dataIndex: 'fixgreen',

    },
    {
      title: '合同类型(固定/无固定)',
      dataIndex: 'signtype',
    },
    {
      title: '续签开始日期',
      dataIndex: 'sdate',
      valueType: 'date',

    },
    {
      title: '续签结束日期',
      dataIndex: 'edate',
      valueType: 'date',
    },

    {
      title: '手机号',
      dataIndex: 'phone',

    },
    {
      title: '创建人',
      dataIndex: 'cuser',

    },
    {
      title: '创建日期',
      dataIndex: 'cdate',
      valueType: 'date'

    },
    {
      title: '簽呈發起時間',
      dataIndex: 'headcrtdate',
      valueType: 'date'
    },
    {
      title: '審核駁回時間',
      dataIndex: 'rejectdate',
      valueType: 'date'

    },
    {
      title: '審核同意時間',
      dataIndex: 'approvedate',
      valueType: 'date'
    },
    {
      title: '發起合同時間',
      dataIndex: 'senddate',
      valueType: 'date'
    }, {
      title: '員工簽署時間',
      dataIndex: 'signdate',
      valueType: 'date'
    }, {
      title: '合同落章生效時間',
      dataIndex: 'finishdate',
      valueType: 'date'
    },
    {
      title: '操作',
      fixed: 'right',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action.startEditable?.(record.uuid);

          }}
        >
          编辑
        </a>,
        <a
          key="editable"
          onClick={() => {
            //action.startEditable?.(record.id);
            NetUtil.post(NetUtil.API.findByIdnum, record)
              .then(data => {
                console.log(data)
              })
          }}
        >
          查看其合同
      </a>,
      ],
    },

  ];
  const [visible, setvisible] = useState(false);
  const [loading, setloading] = useState(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const showModal = () => {
    setvisible(true);
  };

  const handleOk = async (value) => {


    setloading(true);
    setTimeout(() => {
      setloading(false);
      setvisible(false);
    }, 3000);
  }
  const handleCancel = () => {
    setvisible(false);
  }

  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle='登记表格'
        actionRef={actionRef}
        formRef={formRef}
        rowKey="uuid"
        // request={(params, sorter, filter) => dynamicquery1({ ...params, sorter, filter })}
        request={(params, sorter, filter) => {
          if (Object.keys(params).length > 2) {
            return dynamicquery1({ ...params, sorter, filter })
          }
          console.log("params", params);

          //    dynamicquery({ ...params, sorter, filter })
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        toolBarRender={() => [
          <UploadModal />,
          <CSVLink className="csvlink" data={data} headers={headers}  >
            <Button type="primary" icon={<FileExcelOutlined />} >Excel</Button>
          </CSVLink>

        ]}
        search={{
          defaultCollapsed: false,
          optionRender: ({ searchText, resetText }, { form }) => [

            <Button
              key="search"
              type="primary"
              onClick={() => {
                console.log("123", form);
                // dynamicquery1(form);
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {

                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,

            // <Button key="add"
            //   type="primary"
            //   onClick={() => {
            //     exportXuqiann(formRef.current?.getFieldValue());
            //   }}>导出</Button>,

          ],
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (selectedRowsState, row) => {
            console.log(selectedRowsState, row)
            await NetUtil.post(NetUtil.API.saveById, row)
              .then(data => {
                console.log(data)
              })
          },
          onChange: setEditableRowKeys,
        }}
        scroll={{ x: 'max-content' }} />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项
            </div>
          }
        >


          <Button type="primary"
            onClick={async () => {
              //  showModal();

              await releaseqianchengs(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();

            }}>
            发起签呈
          </Button>
          <Button type="primary"
            onClick={async () => {
              //  showModal();

              await handleRelease(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();

            }}>
            批量续签(待签呈审核完成后发起)
          </Button>
          <Modal
            visible={visible}
            title="请选择送签企业"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                退出
            </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                批量签署
            </Button>,
            ]}
          >

            <Select
              showSearch
              style={{ width: 320 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
            >
              <Option value="纬创资通(昆山)有限公司">纬创资通(昆山)有限公司</Option>
              <Option value="昆山开发区第一职业介绍中心">昆山开发区第一职业介绍中心</Option>
              <Option value="苏州苏彭企业管理有限公司" >苏州苏彭企业管理有限公司</Option>
              <Option value="西安录必用企业管理有限公司昆山分公司">西安录必用企业管理有限公司昆山分公司</Option>
              <Option value="昆山奔图企业管理有限公司">昆山奔图企业管理有限公司</Option>
              <Option value="昆山东创人力资源有限公司">昆山东创人力资源有限公司</Option>
              <Option value="昆山协庆企业管理有限公司">昆山协庆企业管理有限公司</Option>
              <Option value="无锡市申博人力资源服务有限公司昆山分公司">无锡市申博人力资源服务有限公司昆山分公司</Option>
              <Option value="苏州鼎聘人力资源有限公司">苏州鼎聘人力资源有限公司</Option>
              <Option value="昆山新里程劳务有限公司">昆山新里程劳务有限公司</Option>
            </Select>

            {/* <Select defaultValue="纬创资通(昆山)有限公司" style={{ width:320 }} onChange={handleChange}>
      <Option value="纬创资通(昆山)有限公司">纬创资通(昆山)有限公司</Option>
      <Option value="昆山开发区第一职业介绍中心">昆山开发区第一职业介绍中心</Option>
      <Option value="苏州苏彭企业管理有限公司" >苏州苏彭企业管理有限公司</Option>
      <Option value="西安录必用企业管理有限公司昆山分公司">西安录必用企业管理有限公司昆山分公司</Option>
      <Option value="昆山奔图企业管理有限公司">昆山奔图企业管理有限公司</Option>
      <Option value="昆山东创人力资源有限公司">昆山东创人力资源有限公司</Option>
      <Option value="昆山协庆企业管理有限公司">昆山协庆企业管理有限公司</Option>
      <Option value="无锡市申博人力资源服务有限公司昆山分公司">无锡市申博人力资源服务有限公司昆山分公司</Option>
      <Option value="苏州鼎聘人力资源有限公司">苏州鼎聘人力资源有限公司</Option>
      <Option value="昆山新里程劳务有限公司">昆山新里程劳务有限公司</Option>
 
    </Select> */}
          </Modal>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default EContractReport;
