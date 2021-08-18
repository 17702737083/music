import React, { useState, useRef } from 'react';
import type { FormInstance } from 'antd';
import ProForm, {
  StepsForm,
  ProFormText,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormUploadDragger,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { Button, message, Modal, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import NetUtil from './NetUtil';
import { downloadtemplate } from '@/pages/hr/recruit/elc/New/service';
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
const downloadtemplatee = async (params?: TableListItem) => {
  const hide = message.loading('正在请求下载');
  try {
    await downloadtemplate();
    hide();
    message.success('下载中...');
    return true;
  } catch (error) {
    hide();
    message.error('下载失败请重试！');
    return false;
  }
};
export default () => {
  const formRef = useRef<FormInstance>();
  const [visible, setVisible] = useState(false);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        <PlusOutlined />
        批量匯入
      </Button>
      <StepsForm
        onFinish={async (values) => {
          console.log('这是参数', values.dragger[0].originFileObj);
          await NetUtil.post(NetUtil.API.uploadCandidateList, values.dragger[0].originFileObj).then(
            (data) => {
              console.log(data);
            },
          );
          setVisible(false);
          message.success('提交成功');
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title="上传文件"
              width={800}
              onCancel={() => setVisible(false)}
              visible={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="template"
          title="下载模板"
          onFinish={async () => {
            await waitTime(2000);
            return true;
          }}
        >
          <ProFormTextArea name="remark" label="备注" width="lg" placeholder="请输入备注" />
          <Button
            key="add"
            type="primary"
            onClick={() => {
              downloadtemplatee(formRef.current?.getFieldsValue());
            }}
          >
            下载模板
          </Button>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="upload" title="上传文件">
          <ProForm.Group>
            <ProFormUploadButton
              label="批量维护"
              name="dragger"
              max={1}
              action="http://192.168.66.57:8015/users/uploadtest"
            />
          </ProForm.Group>

          {/* <Table columns={columns} dataSource={data} size="small" /> */}
          {/* TODO 上传预览 */}
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};
