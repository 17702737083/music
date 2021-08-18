import React, { useState , useRef } from 'react';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { TableListItem } from '@/pages/hr/recruit/elc/New/data' ;
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
import {
 
  downloadtemplate,

} from '@/pages/hr/recruit/elc/New/service';
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
    const [data, setdata] = useState(null);
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
        title: '人员类别',
        dataIndex: 'category',
      },
  
      {
        title: '原因',
        dataIndex: 'failreason  ',
      }
      
      ];
    
      
    return (
        <>
      
            <Button type="primary" onClick={() => setVisible(true)}>
                <PlusOutlined />
                上传文件(并发起合同)
            </Button>
            
            <StepsForm 
                onFinish={async (values) => {
                    console.log("这是参数",values.dragger[0].originFileObj);
                    await NetUtil.post(NetUtil.API.uploadCandidateList,values.dragger[0].originFileObj)
                    .then(data => {
                      setdata(data.dataList);
                    }),
                   // setVisible(false);
                    message.success('提交成功');
                }}
                formProps={{
                    validateMessages: {
                        required: '此项为必填项',
                    },
                }}
                stepsFormRender={(dom, submitter) => {
                    return (
                      //style={{width:1600}}
                        <Modal 
                            title="上传文件(并发起合同)"
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
                <Button key="add"
                type="primary"
                onClick={() => {
                  downloadtemplatee(formRef.current?.getFieldsValue());
                }}>下载模板</Button> 
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

                    <Table columns={columns} dataSource={data} size="small" />
                    {/* TODO 上传预览 */}   
                </StepsForm.StepForm>
            </StepsForm>
        </>
    );
};
