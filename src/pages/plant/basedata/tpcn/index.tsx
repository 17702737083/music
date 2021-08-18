import React, { useEffect, useState,useRef  } from 'react';
import ProCard from '@ant-design/pro-card';
import {  Button, Col,  Descriptions, message, Row, Tabs } from 'antd';
import ProForm, { ProFormText, ProFormSelect, ProFormRadio, ProFormDatePicker, ProFormDateTimePicker, ProFormTextArea, ProFormCheckbox } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import OASignComponent from '@/components/OA/OASign';
import { useModel } from 'umi';
import {saveTpcnDetail ,backFormData , saveMecnDetail} from './service'   
import OAFileUpload from '@/components/OA/OAFileUpload';
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';
import { plant ,station} from './data';
import { OASignInitialProps } from '@/components/OA/OASign/data';
import type { FormInstance } from 'antd';
import './index.less';



const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const props = {
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
          console.log(file, fileList);
      }
  },
  defaultFileList: [

  ],
};

// *************************************自定义********************************************************

const achieveTime =()=> {
  var time = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()
  return time
}  

// *********************************************************************************************
 
export default () => {
 
  const [plant, setPlant] = useState<plant[]>([]);//厂別  
  const [station, setStation] = useState<plant[]>([]);//切入环境 
  const [sstation, setSstation] = useState<string | undefined>();//切入环境
  const [referenceId, setReferenceId] = useState<string | undefined>("");  
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [mode, setMode] = useState<OASignInitialProps["mode"]>("edit");
  const [dictKey, setDictKey] = useState("");
  const [backObj,setBackObj] = useState();
  
  const { initialState } = useModel('@@initialState');
  //初始化查询
  const fetchRemoteData = async(params)=>{
    return await queryDictDetail(params);
  };

//获取厂别
 const getplant = async () => {
    const data: any = await fetchRemoteData("plant.tpcn.plants");
    const dictList = data.data.list;
    let plantlist: plant[] = [];
    dictList.filter(item => item.dictValueSort !== 0)
      .forEach(item => {
          const valueObj = JSON.parse(item.dictValue as string);
          let plantObj: plant = {};
          plantObj = valueObj.plant;
          plantlist.push(plantObj);
      })
      setPlant(plantlist);
  }
 
// ******************************************************************************
  const formRef = useRef<FormInstance>();
 
  useEffect(async () => {
    const tempReferenceId = initialState?.getQueryString("referenceId");
    //获取url参数。更新referenceId的值。123 
    // setReferenceId(tempReferenceId ? tempReferenceId : undefined);
    setReferenceId(tempReferenceId);

    setReadOnly(tempReferenceId ? true : false);
    if(tempReferenceId ? true : false) {
       const backObj = await backFormData(tempReferenceId);//通过referenceid获取后端数据
       console.log(backObj);
       formRef?.current?.setFieldsValue({
        plant: backObj?.plant,
        project: backObj?.project,
     filekind: backObj?.filekind,
     releasedate: backObj?.releasedate,
     expectdate: backObj?.expectdate,
     teststart: backObj?.teststart,
     testend: backObj?.testend,
      prouploadtime: backObj?.prouploadtime,
       impactmodel: backObj?.impactmodel,
     station: backObj?.station,
     line: backObj?.line,
     stage: backObj?.stage,
    oldversion: backObj?.oldversion,
     newversion: backObj?.newversion ,
      description: backObj?.project,
      solution: backObj?.solution,
       virus: backObj?.virus
      });
    } else {
      getplant(); 
    }
  }, []);







 // 送签
  const handleSubmit = async (values) => {
      const datas = await saveTpcnDetail(values);
      console.log(datas) 
        
        setMode("edit"); 
        // setDictKey("plant.tpcn");
        setReadOnly(referenceId != "" ? true : false);
        return; 
  };
 
 
  const add =(values :any) => {    
   let arr = { applyid:initialState?.currentUser?.employeeInfoDTO?.cname },dep = { dep:initialState?.currentUser?.employeeInfoDTO?.deptid },
       formid= {referenceId}
   let test = { ...formid,...arr,...dep,...values }
    
    return test
  } 
  const { TabPane } = Tabs; 
  //******************************return***********************************/
  return (
      <> 
      <div className="card-container">
    <Tabs type="card">
      <TabPane tab="TE测试表单" key="1">
      <ProCard style={{ marginTop: 8 }} gutter={8}  > 
          <ProForm   formRef={formRef} 
           
                  onFinish = {async (values) => {  
                    console.log(add(values));
                    if(add(values).referenceId == '')
                    message.success("请先点击产生签核流程");
                    else{handleSubmit(add(values));
                      message.success("表单完成");}
                    
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
                <Descriptions.Item label="申请日期"> {achieveTime()}</Descriptions.Item> 
                </Descriptions> 


              <ProForm.Group>
 
                <ProFormSelect
                  options = {plant} 
                  name="plant"
                  label="厂别"
                  width="sm"  
                  rules={[{ required: true, message: '请选择厂别!' }]}
                  placeholder={ '请选择厂别'} 
                  disabled={readOnly}
                />

                <ProFormText
                  width="sm"
                  name="project"
                  label="主旨"
                  rules={[{ required: true, message: '请输入主旨！' }]}
                  placeholder="请输入名称"
                  disabled={readOnly}
                />

                <ProFormRadio.Group
                  width="sm"
                  name="filekind"
                  label="类型"
                  rules={[{ required: true, message: '请选择类型！' }]}
                  options={[
                    {
                      label: 'Fixed',
                      value: 'Fixed',
                    },
                    {
                      label: 'Released',
                      value: 'Released',
                    },
                  ]}
                  disabled={readOnly}
                /> 
                <span>
                <div>PFMEA上传</div>
                {/* <OAFileUpload
                            uploadColumns=''
                            onFinish={{
                              success: async data => { 
                                console.log("received result from upload component", data)
                              }
                            }} /> */}
                </span>


                <Row>
                  <Col span={4}>
                  <ProFormDatePicker 
                    
                    name="releasedate"
                    label="客户发布日期"
                    rules={[{ required: true }]}
                    disabled={readOnly}
                  />
                  </Col> 
                  <Col span={4}> 
                  <ProFormDatePicker 
                    name="expectdate"
                    label="客户预期日期"
                    rules={[{ required: true }]}
                    disabled={readOnly}
                  /></Col>
                 <Col span={5}>
                  <ProFormDateTimePicker 
                    name="teststart"
                    label="测试开始时间"
                    rules={[{ required: true }]}
                    disabled={readOnly}
                  />
                  </Col>
                  <Col span={5}>
                  <ProFormDateTimePicker 
                    name="testend"
                    label="测试结束时间"
                    rules={[{ required: true }]}
                    disabled={readOnly}
                  />
                  </Col>
                  <Col span={5}>
                  <ProFormDateTimePicker 
                    name="prouploadtime"
                    label="程式上线时间"
                    rules={[{ required: true }]}
                    disabled={readOnly}
                  />
                  </Col>
                </Row>
                   
                <Row>
                  <Col span={6}>
                  <ProFormText 
                    name="impactmodel"
                    label="影响架构"
                    placeholder="请输入受影响的架构"
                    rules={[{ required: true }]}
                    disabled={readOnly}
                  />
                  </Col>
                  
                  <Col span={6}> 
                  <ProFormSelect
                  options = {station}
                  fieldProps={{ value: sstation }}
                  name="station"
                  label="导入环境"
                  rules={[{ required: true, message: '请选择厂别!' }]}
                  placeholder={ '请输入名称'} 
                  disabled={readOnly}
                  />  
                   </Col>
                  <Col span={6}>
                  <ProFormText  
                  name="line" 
                  label="线别"  
                  rules={[{ required: true }]} 
                  disabled={readOnly}/> 
                  
                  </Col>
                  <Col span={6}>
                  <ProFormText 
                  name="stage"  
                  label="站别"  
                  rules={[{ required: true }]} 
                  disabled={readOnly}/>
                  
                  </Col>


                  <Col span={6}>
                  <ProFormText 
                  name="oldversion"  
                  label="原始版本"  
                  rules={[{ required: true }]} 
                  disabled={readOnly}
                  />
                  
                  </Col>
                  <Col span={6}>
                  <ProFormText 
                  name="newversion" 
                  label="最新版本"  
                  rules={[{ required: true }]} 
                  disabled={readOnly}/>
                   
                  </Col>
                  <Col span={6}>
                  <ProFormTextArea
                    width="md"
                    name="description"
                    label="异常描述"
                    placeholder="请输入异常描述" 
                    disabled={readOnly}
                  /> 
                  </Col>
                  <Col span={6}>
                  <ProFormTextArea
                    width="md"
                    name="solution"
                    label="解决对策"
                    placeholder="请输入解决对策" 
                    disabled={readOnly}
                  />
                  </Col>
                  </Row>
                   
                  <ProFormText
                    width="sm"
                    name="virus" label="OfficeScan病毒版本号"
                    placeholder="OfficeScan病毒版本号"
                    disabled={readOnly}
                  />
                  <span>
                    <div>附加文件</div>
                    {/* <OAFileUpload onFinish={{ success: async data => { handelUpload(data) } }} /> */}
                  </span>

                  <Button disabled={readOnly} onClick={() => {
                    
                    setDictKey("plant.tpcn");

                  }} >产生签核流程</Button>
              </ProForm.Group>

              </ProForm>
              <OASignComponent
                  initialValues={{ 
                  dictKey: dictKey,
                  autoGenerateRefenceId: true,
                  referenceId: referenceId,
                  mode: mode,
                  callBackUrl:"/plant/basedata/tpcn",
                  category:"测试大类",
                  subCategory:"测试小类",
                  item:"tpcnForm"
                  }}

                  onCreate={
                    {
                        success: async (res) => {
                            console.log("开单", res);  
                            setReferenceId(res[0].referenceId);
                            message.success( "已自动生成签核单据");
                        },
                        fail: async (res) => {
                        }
                    }
                  }
                  onApprove={
                    {  
                      success: async (data) => {
                          console.log("签核成功", data);
                      },
                    }
                  }
                  onReject={
                    { 
                        success: async (data) => {
                          console.log("驳回成功", data); 
                        
                        },
                    }
                  }
              > 
        </OASignComponent>
             
        </ProCard>
      </TabPane>
      <TabPane tab="工程表单" key="2" > 
      <ProCard style={{ marginTop: 8 }} gutter={8}  > 
          <ProForm<{
                    name: string;
                    company: string;
                }>
                  onFinish={async (values) => {
                    await waitTime(2000);
                    console.log(add(values));
                    await saveMecnDetail(add(values));
                    message.success('提交成功'); 
                  }}
                >

                <Descriptions >
                <Descriptions.Item 
                label="申请人" 
                >{initialState?.currentUser?.employeeInfoDTO?.cname}</Descriptions.Item>
                <Descriptions.Item 
                label="申请人部门">
                {initialState?.currentUser?.employeeInfoDTO?.deptid}
                </Descriptions.Item>
                <Descriptions.Item label="申请日期"> 
                {achieveTime()}
                </Descriptions.Item> 
                </Descriptions>  
              <ProForm.Group>
 
              <ProFormCheckbox.Group
                  name="checkbox"
                  layout="horizontal"
                  label="选择"
                  options={['GP', 'HF', 'None','RoHS','RoHS2']}
                  rules={[{ required: true, message: '请选择！' }]}
                />
 

                 <ProFormRadio.Group
                  width="md"
                  name="filekind"
                  label="类型"
                  rules={[{ required: true, message: '请选择类型！' }]}
                  options={[
                    {
                      label: 'ECN',
                      value: 'ECN',
                    },
                    {
                      label: 'ECR',
                      value: 'ECR',
                    },
                    {
                      label: 'Engineering Issue',
                      value: 'EngineeringIssue',
                    },
                  ]}
                /> 
 
                <ProFormSelect
                  options = {plant} 
                  name="plant"
                  label="厂别"
                  width="sm"  
                  rules={[{ required: true, message: '请选择厂别!' }]}
                  placeholder={ '请选择厂别'} 
                />
                
                <ProFormText 
                  name="PartNo" 
                  label="PartNo"  
                    />
                <ProFormText
                  width="sm"
                  name="project"
                  label="主旨"
                  //tooltip="最长为 24 位"
                  rules={[{ required: true, message: '请输入主旨！' }]}
                  placeholder="请输入名称"
                />

                {/* <ProCard bordered> 
                  <div> 
                    <table border = "1">
                      <tr>
                        <th colSpan = "4">Actions</th>
                        </tr>
                        <tr>
                         <td rowSpan ="4"><ProFormSelect
                name="place"
                label="廠區"
                width="sm" 
                request={async () => placeList
                }
                rules={[{ required: true, message: '请选择厂區!' }]}
                /></td> 
                         <td   rowSpan = "2">WIP</td> 
                         <td>Material</td> 
                         <td>
                           <Checkbox value="RE">RE.</Checkbox>
                           <Checkbox value="GO">GO</Checkbox>
                         </td> 
                        </tr>  
                        <tr> 
                         <td>F/G</td>
                         <td>
                           <Checkbox value="RE">RE.</Checkbox>
                           <Checkbox value="GO">GO</Checkbox>
                         </td> 
                        </tr>   
                        <tr> 
                         <td rowSpan = "2">STOCK</td> 
                         <td>F/G</td> 
                         <td>
                           <Checkbox value="RE">RE.</Checkbox>
                           <Checkbox value="GO">GO</Checkbox>
                         </td> 
                        </tr>  
                        <tr>  
                         <td>Material</td> 
                         <td>
                           <Checkbox value="RE">RE.</Checkbox>
                           <Checkbox value="GO">GO</Checkbox>
                         </td> 
                        </tr>  
                    </table>
                   


                  </div>
                </ProCard> */}

                  <ProFormDatePicker 
                    
                    name="releasedate"
                    label="切入日期"
                    rules={[{ required: true }]}
                  /> 
            
                   
                  <ProFormTextArea
                    width="md"
                    name="description"
                    label="描述" 
                  />  
                  <ProFormTextArea
                    width="md"
                    name="reason"
                    label="原因" 
                  /> 
                  <Row>   
                  <Col span={8}>
                  <ProFormTextArea
                    width="md"
                    name="ssolution"
                    label="短期对策" 
                  />
                  </Col>
                  <Col span={8}>
                  <ProFormTextArea
                    width="md"
                    name="lsolution"
                    label="长期对策" 
                  />
                  </Col>
                  <Col span={8}>
                  <ProFormTextArea
                    width="md"
                    name="remark"
                    label="备注" 
                  />
                  </Col>
                  </Row>

{/* 
                  <Upload {...props}>
                    <Button 
                    size = {'small'}
                    shape = {'round'} 
                    icon={<UploadOutlined />} >PFAME</Button>
                  </Upload>  
                  
                  <Upload {...props}>
                    <Button 
                    size = {'small'}
                    shape = {'round'} 
                    icon={<UploadOutlined />} >附加文件</Button>
                  </Upload>  */}
              </ProForm.Group>
              

            </ProForm> 
            {/* <OASignComponent
                initialValues={{ 
                autoGenerateRefenceId: true,
                dictKey: "plant.tpcn",
                referenceId: referenceId,
                callBackUrl:"/plant/basedata/report",
                mode: "edit",
                category:"测试大类",
                subCategory:"测试小类",
                item:"mecnForm"
                }
                }>
              </OASignComponent> */}
        </ProCard>
      </TabPane>
      <TabPane tab="Tab Title 3" key="3">
        <p>Content of Tab Pane 3</p> 
      </TabPane>
    </Tabs>
  </div>,
     
    </>
  );
};
 