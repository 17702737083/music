import React, { useEffect, useState,useRef  } from 'react';
import ProCard from '@ant-design/pro-card';
import {  Button, Col,  Descriptions, message, Row } from 'antd';
import ProForm, { ProFormText, ProFormSelect, ProFormRadio, ProFormDatePicker, ProFormDateTimePicker, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout'; 
import OAFileUpload , { UploadColumn } from '@/components/OA/OAFileUpload';
import type { FormInstance } from 'antd'; 
import { useModel } from 'umi';
import {saveITbase} from './service';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  
  
 
export default () => {
    const { initialState } = useModel('@@initialState');
    const achieveTime =()=> {
      var time = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()
      return time
    }  
    
    const [readOnly, setReadOnly] = useState<boolean>(false);
  const handleSubmit = async (values) => {
      const datas = await saveITbase(values);
      console.log(datas)  
        return; 
  };
  const uploadColumns: UploadColumn[] = [
    { order: 1, key: "site", title: "厂别", sample: "WKS" },
    { order: 2, key: "dept", title: "部门", sample: "MEL100" },
    { order: 3, key: "lheadcount", title: "leader计划人力", sample: "2" },
    { order: 4, key: "eheadcount", title: "engineer计划人力", sample: "10" }, 
  ];

   const UploadColumnSkill: UploadColumn[] = [
    { order: 1, key: "driverId", title: "司機身份證", sample: "33078119850907283X" },
    { order: 2, key: "truckNo", title: "車牌", sample: "蘇EAB123" },
    { order: 3, key: "company", title: "公司", sample: "L230" },
    { order: 4, key: "plant", title: "廠別", sample: "F230" }, 
  ];

  //******************************return***********************************/
  return (
    <>
      <PageContainer>
        <ProCard style={{ marginTop: 8 }} gutter={8}  > 
          <ProForm     
                  onFinish = {async (values) => {  
                    console.log(values);
                    handleSubmit(values);
                    
                    }}
                    submitter = {{
                      submitButtonProps:{
                        disabled: readOnly
                      },
                      resetButtonProps:{
                        disabled: readOnly
                      },
                    }}
                >
                

                <Descriptions >
                <Descriptions.Item 
                label="申请人" >{initialState?.currentUser?.employeeInfoDTO?.cname}</Descriptions.Item>
                <Descriptions.Item label="申请人部门">{initialState?.currentUser?.employeeInfoDTO?.deptid}</Descriptions.Item>
                <Descriptions.Item label="维护日期"> {achieveTime()}</Descriptions.Item> 
                </Descriptions> 


              <ProForm.Group>
 
               
                <span>
                <div>上传计划人力</div>
                <OAFileUpload
                            uploadColumns='UploadColumns'
                            onFinish={{
                              success: async data => { 
                                console.log("received result from upload component", data)
                              }
                            }} />
                 </span> 
                 
                 </ProForm.Group>
                 <ProForm.Group>
                 <span>    
                 <div>上传人员信息</div>       
                 <OAFileUpload
                            uploadColumns='UploadColumnSkill'
                            onFinish={{
                              success: async data => { 
                                console.log("received result from upload component", data)
                              }
                            }} />
                 </span>
                  &nbsp;&nbsp;&nbsp;
                  
              </ProForm.Group>

              </ProForm>
                 
        </ProCard>
 
      </PageContainer>
    </>
  );
}; 