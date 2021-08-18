import { Button, message, Modal, Select } from 'antd';
import type { FormInstance } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem, TableListParams } from './data';
import NetUtil from './NetUtil';
import {
  exportExcel,
  dynamicquery,
  releaseCandidate,
} from './service';


import UploadModalCandudate from '@/components/UploadModalCandidate';
import UploadModalCandudateAndRelease from '@/components/UploadModalCandidateAndRelease';
import UploadReCall from '@/components/UploadReCall';

/**
 * 发起e签宝签署
 *
 * @param selectedRows
 */
const handleRelease = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在发起e签宝签署~');
  if (!selectedRows) return true;
  // try {
    await releaseCandidate(selectedRows).then((result)=>{
     console.log(result,"r33333333333333333333333");
      
    });
    hide();

    message.success('发起e签宝签署成功，即将刷新');
    return true;
  // } catch (error) {
    alert(3 )
    hide();
    message.success('发起e签宝签署成功，即将刷新');
    return true;
  // }
};
const dynamicquery1 = async (params?: TableListParams) => {
  const hide = message.loading('正在查询');
  try {
    await dynamicquery(params).then((reslut) => {
      console.log("reslut", reslut);

    });
    hide();
    message.success('查询完毕!');
    return true;
  } catch (error) {
    hide();
    message.error('查询失败请重试！');
    return false;
  }
};
const handleExportExcel = async (params?: TableListItem) => {
  const hide = message.loading('正在请求下载');
  try {
    await exportExcel(params);
    console.log("导出参数", params)
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
  const [visible, setvisible] = useState(false);
  const [loading, setloading] = useState(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const formRef = useRef<FormInstance>();
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [data, setData] = useState<TableListItem[]>([]);
  const [collapsed, setCollapsed] = useState(false);
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
  const columns: ProColumns<TableListItem>[] = [

    {
      title: '姓名',
      dataIndex: 'name',
    }, {
      title: '手机',
      dataIndex: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      filters: true,
      onFilter: true,
      valueEnum: {
        男: { text: '男' },
        女: { text: '女' },
      },
    },
    {
      title: '身份证号',
      dataIndex: 'idnumber',
      valueType: 'textarea',
    },
    {
      title: '身份证住址',
      dataIndex: 'idcardaddress',

    },
    {
      title: '填单日期',
      dataIndex: 'createdate',
      valueType: 'date',
    },
    {
      title: '實際報到日期',
      dataIndex: 'interviewdate',
      valueType: 'date',
    },
    {
      title: '发起之日至今天数',
      dataIndex: 'daystodate',
    },
    {
      title: '人员类别',
      dataIndex: 'category',
      filters: true,
      onFilter: true,
      valueEnum: {
        DL: { text: 'DL' },
        IDL: { text: 'IDL' },
        IDLIntern: { text: 'IDLIntern' },
      },
    },
    {
      title: '纬创合同签署状态',
      dataIndex: 'signstate',
      filters: true,
      onFilter: true,
      valueEnum: {
        '已发起签署': { text: '已发起签署' },
        '员工已签署': { text: '员工已签署' },
        '已盖章': { text: '已盖章' },
        '离职未盖章': { text: '离职未盖章' },
        '未发起签署': { text: '未发起签署' },
      },
    }, {
      title: '派遣合同签署状态',
      dataIndex: 'paiqianstate',
      filters: true,
      onFilter: true,
      valueEnum: {
        '已发起签署': { text: '已发起签署' },
        '员工已签署': { text: '员工已签署' },
        '已盖章': { text: '已盖章' },
        '离职未盖章': { text: '离职未盖章' },
        '未发起签署': { text: '未发起签署' },
      },
    },
    {
      title: '民族',
      dataIndex: 'nation',
    },
    {
      title: '送签主体甲方公司',
      dataIndex: 'sendingbody',
      filters: true,
      valueEnum: {
        '纬创资通(昆山)有限公司': { text: '纬创资通(昆山)有限公司' },
        '昆山开发区第一职业介绍中心': { text: '昆山开发区第一职业介绍中心' },
        '苏州苏彭企业管理有限公司': { text: '苏州苏彭企业管理有限公司' },
        '西安录必用企业管理有限公司昆山分公司': { text: '西安录必用企业管理有限公司昆山分公司' },
        '昆山奔图企业管理有限公司': { text: '昆山奔图企业管理有限公司' },
        '昆山东创人力资源有限公司': { text: '昆山东创人力资源有限公司' },
        '昆山协庆企业管理有限公司': { text: '昆山协庆企业管理有限公司' },
        '无锡市申博人力资源服务有限公司昆山分公司': { text: '无锡市申博人力资源服务有限公司昆山分公司' },
        '苏州鼎聘人力资源有限公司': { text: '苏州鼎聘人力资源有限公司' },
        '昆山新里程劳务有限公司': { text: '昆山新里程劳务有限公司' },
        '昆山昆之泰服務外包有限公司': { text: '昆山昆之泰服務外包有限公司' },
        '一职介': { text: '一职介' },
        '协庆': { text: '协庆' },
        '东创': { text: '东创' },
        '奔图': { text: '奔图' },
        '新里程': { text: '新里程' },
        '鼎聘': { text: '鼎聘' },
        '苏彭': { text: '苏彭' },
        '申博': { text: '申博' },
        '录必用': { text: '录必用' },
        '昆之泰': { text: '昆之泰' },

      },
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
            action.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="editable"
          onClick={() => {
            //action.startEditable?.(record.id);
            NetUtil.post(NetUtil.findByIdnum, record)
              .then(data => {
                console.log(data)


              })




          }}
        >
          查看其合同
      </a>,
      ],
    },
    // ,
    // {
    //   title: '签署状态0已完成/1未完成',
    //   dataIndex: 'signstate',
    // }
  ];
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
        rowKey="id"
      
        request={(params, sorter, filter ) => {
          if(Object.keys(params).length>2){
              return dynamicquery({ ...params, sorter, filter })
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
          <UploadReCall />,
          <UploadModalCandudate />,
          <UploadModalCandudateAndRelease />
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

            <Button key="add"
              type="primary"
              onClick={() => {
                handleExportExcel(formRef.current?.getFieldsValue());
              }}>导出</Button>,
          ],
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (selectedRowsState, row) => {
            console.log(selectedRowsState, row)
            await NetUtil.API.post(NetUtil.API.saveById, row)
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

              await handleRelease(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();

            }}>
            批量签署
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
