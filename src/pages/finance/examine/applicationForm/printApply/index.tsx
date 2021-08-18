import React, {  useEffect, useRef, useState  } from 'react';
import { message,Upload,Button,FormInstance,Descriptions,Space,Select,Checkbox,Divider,Form} from 'antd';
import ProForm, { ProFormText,ProFormSelect,ProFormDatePicker,ProFormTextArea,ProFormCheckbox} from '@ant-design/pro-form';
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { initForm, savePrintApply, changeState, changeFlag } from './service';
import { queryCurrentUser } from '@/pages/system/service';
import { FormattedMessage, getLocale, useIntl, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less';
import {PrintApplyParams, SysPrintApply, CompanyData, DataSourceType} from './data';
import OASignComponent from '@/components/OA/OASign';
import { OASignInitialProps } from '@/components/OA/OASign/data';
import moment from 'moment';
import UploadModalCandudate from '@/components/UploadModalCandidate';
import UploadModalCandudateAndRelease from '@/components/UploadModalCandidateAndRelease';
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';
import { List } from 'lodash';

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

const applyproject = [
  { label: '法人代表章', value: '法人代表章' },
  { label: '公章', value: '公章' },
  { label: '行政及人力資源管理章', value: '行政及人力資源管理章' },
]

const filekind = [
  { label: '非制式文件', value: '非制式文件' },
  { label: '制式文件', value: '制式文件' },
]

const company = [
  { label: '緯創', value: '緯創' },
  { label: '緯智', value: '緯智' },
  { label: '緯隆', value: '緯隆' },
  { label: '緯新', value: '緯新' },
  { label: '緯潤', value: '緯潤' },
  { label: '緯騰', value: '緯騰' },
  { label: '緯績', value: '緯績' },
  { label: '緯穎', value: '緯穎' },
  { label: '緯聰', value: '緯聰' },
  { label: '緯視晶', value: '緯視晶' },
  { label: '緯晶上海', value: '緯晶上海' },
  { label: '蔚隆', value: '蔚隆' },
]

const kindfile = [
  { label: 'B-Debit invoice扣款', value: 'B-Debit invoice扣款' },
  { label: 'B-發票拒收證明', value: 'B-發票拒收證明' },
  { label: 'L-中國移動手機統付申請', value: 'L-中國移動手機統付申請' },
  { label: 'T-商檢相關文件', value: 'T-商檢相關文件' },
  { label: 'T-證書申請', value: 'T-證書申請' },
  { label: 'T-關務部情況說明', value: 'T-關務部情況說明' },
  { label: 'U-新建工程報建', value: 'U-新建工程報建' },
  { label: 'U-廠務用發文', value: 'U-廠務用發文' },
  { label: 'O-各類考試報名表', value: 'O-各類考試報名表' },
  { label: 'O-其他', value: 'O-其他' },
  { label: 'O-員工各類上崗證/卡的辦理,註冊,註銷,轉入,轉出等', value: 'O-員工各類上崗證/卡的辦理,註冊,註銷,轉入,轉出等' },
  { label: 'O-酒店預訂單', value: 'O-酒店預訂單' },
  { label: 'O-廠商詢證函', value: 'O-廠商詢證函' },
]

const kindfiles = [
  { label: 'A-各种证照申請,延期,換發等用印', value: 'A-各种证照申請,延期,換發等用印' },
  { label: 'F-LC相關', value: 'F-LC相關' },
  { label: 'F-外匯核銷相關', value: 'F-外匯核銷相關' },
  { label: 'F-財務付款專用', value: 'F-財務付款專用' },
  { label: 'F-財務報表用印', value: 'F-財務報表用印' },
  { label: 'F-提供給政府部門的申請,報表及年檢資料', value: 'F-提供給政府部門的申請,報表及年檢資料' },
  { label: 'F-結匯相關', value: 'F-結匯相關' },
  { label: 'F-會計師事務所客戶申明書', value: 'F-會計師事務所客戶申明書' },
  { label: 'F-遞交給銀行的各種申請', value: 'F-遞交給銀行的各種申請' },
  { label: 'F-銀行文件用印', value: 'F-銀行文件用印' },
  { label: 'H-外籍稅務新增清退材料', value: 'H-外籍稅務新增清退材料' },
  { label: 'H-員工工傷認定申請及傷殘鑑定申請', value: 'H-員工工傷認定申請及傷殘鑑定申請' },
  { label: 'O-公司各種證照複印件加蓋公章', value: 'O-公司各種證照複印件加蓋公章' },
  { label: 'Q-中國質量認證中心相關資料', value: 'Q-中國質量認證中心相關資料' },
  { label: 'T-A類企業年審資料', value: 'T-A類企業年審資料' },
  { label: 'T-印刷電路板邊角料專賣相關', value: 'T-印刷電路板邊角料專賣相關' },
  { label: 'T-核销文件', value: 'T-核销文件' },
  { label: 'T-異地海關文件', value: 'T-異地海關文件' },
  { label: 'T-報關委託書', value: 'T-報關委託書' },
  { label: 'U-提供給質監局設備年檢報告', value: 'U-提供給質監局設備年檢報告' },
  { label: 'F-保險類收款發票', value: 'F-保險類收款發票' },
]
//   'A-各种证照申請,延期,換發等用印': 'A-各种证照申請,延期,換發等用印' ,
//   'F-LC相關': 'F-LC相關' ,
//   'F-外匯核銷相關': 'F-外匯核銷相關' ,
//   'F-財務付款專用': 'F-財務付款專用' ,
//   'F-財務報表用印': 'F-財務報表用印' ,
//   'F-提供給政府部門的申請,報表及年檢資料': 'F-提供給政府部門的申請,報表及年檢資料' ,
//   'F-結匯相關': 'F-結匯相關' ,
//   'F-會計師事務所客戶申明書': 'F-會計師事務所客戶申明書' ,
//   'F-遞交給銀行的各種申請': 'F-遞交給銀行的各種申請' ,
//   'F-銀行文件用印': 'F-銀行文件用印' ,
//   'H-外籍稅務新增清退材料': 'H-外籍稅務新增清退材料' ,
//   'H-員工工傷認定申請及傷殘鑑定申請': 'H-員工工傷認定申請及傷殘鑑定申請' ,
//   'O-公司各種證照複印件加蓋公章': 'O-公司各種證照複印件加蓋公章' ,
//   'Q-中國質量認證中心相關資料': 'Q-中國質量認證中心相關資料' ,
//   'T-A類企業年審資料': 'T-A類企業年審資料' ,
//   'T-印刷電路板邊角料專賣相關': 'T-印刷電路板邊角料專賣相關' ,
//   'T-核销文件': 'T-核销文件' ,
//   'T-異地海關文件': 'T-異地海關文件' ,
//   'T-報關委託書': 'T-報關委託書' ,
//   'U-提供給質監局設備年檢報告': 'U-提供給質監局設備年檢報告' ,
//   'F-保險類收款發票': 'F-保險類收款發票' ,
// }



export default () => {

  const actionRef = useRef<ActionType>();

  const [referenceId, setReferenceId] = useState<string | undefined>("");
  const [dictKey, setDictKey] = useState("");
  const [mode, setMode] = useState<OASignInitialProps["mode"]>("edit");
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const [printApplyParams,setPrintApplyParams]: any = useState<SysPrintApply>({});

  const [applyid, setApplyid] = useState('');//工号
  const [applyname, setApplyname] = useState('');//姓名
  const [applyerdeptid, setApplyerdeptid ] = useState('');//部门
  const [applydatetime, setApplydatetime ] = useState('');//填单日期

  const [site, setSite] = useState<string | undefined>();//公司别
  const [kind,setKind] = useState<string | undefined>();//文件類型
  const [file,setFile] = useState<string | undefined>();//文件
  const [files,setFiles] = useState<string | undefined>();//文件
  const [cachet, setCachet] = useState([]);//所需公章
  const [projectsort,setProjectsort] = useState<string | undefined>();//申请项目
  const [proinstruction, setProinstruction] = useState<string | undefined>();//申请内容

  const [AfuFormP26proposer,setAfuFormP26proposer] = useState<DataSourceType[]>();
  
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [kindfileOnly, setKindfileOnly] = useState<boolean>(true);
  const [kindfilesOnly,setKindfilesOnly] = useState<boolean>(true);

  //判斷當前語言
  const locale = getLocale(); 

  const columns = [
    {
        title: '部门',
        dataIndex: 'applyerdeptid',
        width: '16%',
      },
    {
        title: '工号',
        dataIndex: 'applyid',
        width: '16%',
      },
    {
        title: '中文名称',
        dataIndex: 'applyname',
        width: '16%',
      },
    {
        title: '英文名称',
        dataIndex: 'applyenname',
        width: '16%',
      },
    {
        title: '分机',
        dataIndex: 'applyphone',
        width: '16%',
      },
    {
        title: '操作',
        valueType: 'option',
        width: '20%',
        render: (text, record, _, action) => [        
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              setAfuFormP26proposer(AfuFormP26proposer.filter((item) => item.id !== record.id));
            }}
          >
            删除
          </a>,
        ],
      },
  ]

  useEffect(async () => {
    const tempReferenceId = initialState?.getQueryString("referenceId");
    //获取url参数。更新referenceId的值。123
    setReferenceId(tempReferenceId ? tempReferenceId : undefined);
    setReadOnly(tempReferenceId ? true : false);
    if(tempReferenceId ? true : false) {
      const datas = await initForm(tempReferenceId);
      console.log(datas.data.AfuFormP26proposer, "PrintApplyParams");
      setPrintApplyParams(datas.data.afuFormP26f002)
      initbase(datas.data.afuFormP26f002);
      initproposer(datas.data.AfuFormP26proposer);

    } else {
      getbase();
    }
  }, []);

    //初始化 厂别等
    const initbase = (datas) => {
      console.log(datas);
      setApplyid(datas?.applyid);
      setApplyname(datas?.applyname);
      setApplyerdeptid(datas?.applyerdeptid);
      setApplydatetime(datas?.applydatetime);
  
      // let cachets = datas?.applyproject;
      // var array = cachets.split(",");
      setCachet(datas?.applyproject.split(","));
      console.log(datas?.applyproject.split(","),"1111111")
      setSite(datas?.company);
      setProjectsort(datas?.projectsort);
      setKind(datas?.filekind)
      if(datas?.filekind == '非制式文件') {
        setKindfileOnly(false);
        setKindfilesOnly(true);
        setFile(datas?.kindfile);
      } else {
        setKindfileOnly(true);
        setKindfilesOnly(false);
        setFiles(datas?.kindfiles.split(","));
      }

      setProinstruction(datas?.proinstruction)
    }

  const initproposer = (datas) => {
    setAfuFormP26proposer(datas);
  }

  //获取人员信息
  const getbase = async () => {
    setApplyid(initialState?.currentUser?.employeeInfoDTO?.emplid);
    if (!locale || locale === 'en-US') 
      {     
        setApplyname(initialState?.currentUser?.employeeInfoDTO?.ename); 
        setProjectsort('A Class')
      } else {    
        setApplyname(initialState?.currentUser?.employeeInfoDTO?.cname);
        setProjectsort('一类')
    }
    setApplyerdeptid(initialState?.currentUser?.employeeInfoDTO?.deptid);
    setApplydatetime(moment().format('YYYY-MM-DD HH:mm:ss'));
  }


  //调用初始化查询
  const fetchRemoteData = async (params) => {
    return await queryDictDetail(params);
    };

  const getfile = async (e: any) => {
    if(e == '非制式文件') {
      setKindfileOnly(false);
      setKindfilesOnly(true);
    } else {
      setKindfileOnly(true);
      setKindfilesOnly(false);
    }
  }
  //获取公司别
  // const getCompany = async () => {
  //   const data: any = await fetchRemoteData("finance.examine.companyCode");
  //   const dictList = data.data.list;
  //   let list: CompanyData[] = [];
  //   dictList.filter(item => item.dictValueSort !== 0)
  //     .forEach(item => {
  //         const valueObj = JSON.parse(item.dictValue as string);
  //         let Obj: CompanyData = {};
  //         Obj = valueObj.sapCompanyCode;
  //         list.push(Obj);
  //     })
  //     setFormsite(list);
  //   };

  const intl = useIntl();
  const handleSubmit = async (list) => {
    //setSubmitting(true);
    try {
      // 送签
      const datas = await savePrintApply(list);
      console.log(datas)
      if (datas.status === "ok") {
        //message.success('送簽成功！');
        setMode("edit");
        setReferenceId(datas.data?.referenceid);
        //setDictKey("sign.demo0429");
        setDictKey("finance.examine.signDebitNote");
        setReadOnly(referenceId != "" ? true : false);
        return;
      }
      message.error('送簽失败,请重试！');
    } catch (error) {
      message.error('送簽失败,请重试！');
    }
    //setSubmitting(false);
  };
  return (
      <div>
          <PageContainer>
              <ProForm layout="horizontal"
                  onFinish={async (values) => {
                      //console.log(materialsDetail,"materialsDetail");
                      let list: any = {
                        PrintApplyParams: {},
                        AfuFormP26proposer: {},
                      };
                      values.applyid = applyid;
                      values.applyname = applyname;
                      values.applyerdeptid = applyerdeptid;
                      values.applydatetime = applydatetime;
                      let array = '';
                      let array2 = '';
                      for ( var i = 0; i < values.applyproject.length; i++) {
                        let temp = values.applyproject[i].value;
                        array += temp + ",";
                      }
                      for ( var i = 0; i < values.kindfiles.length; i++) {
                        let temp = values.kindfiles[i].value;
                        array2 += temp + ",";
                      }
                      array = array.substring(0, array.length - 1);
                      array2 = array2.substring(0, array2.length - 1);
                      values.applyproject = array;
                      values.kindfiles = array2;
                      list.PrintApplyParams = values;
                      list.AfuFormP26proposer = AfuFormP26proposer;
                      handleSubmit(list);
                  }}
                  submitter= {{
                    submitButtonProps: {
                      // 隐藏提交按钮
                      disabled : readOnly
                    },
                    resetButtonProps: {
                      // 隐藏重置按钮
                        disabled : readOnly
                    },
                  }}
                  >
                  <ProCard style={{ width:'100%' }}>

                      <ProForm.Group>
                          <Descriptions>
                            <Descriptions.Item name="applyid" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.user', defaultMessage: '填单人'})}>{applyid}-{applyname}</Descriptions.Item>
                            <Descriptions.Item name="applyerdeptid" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.userDepartment', defaultMessage: '填單人部門'})}>{applyerdeptid}</Descriptions.Item>
                            <Descriptions.Item name="applydatetime" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.userSignDate', defaultMessage: '填單時間'})}>{applydatetime}</Descriptions.Item>
                          </Descriptions>
                          <ProFormSelect width="sm" fieldProps={{ value: site}} options={company} name="company"
                              label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.conpanyType', defaultMessage: '公司别'})}
                              rules={[{ message: (<FormattedMessage  id="pages.finance.examine.applicationForm.printapply.conpanyType.require" defaultMessage="请选择公司别!" />), }]}
                              placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.conpanyType.placeholder', defaultMessage: '请选择公司别'})}
                              disabled={readOnly}
                              />
                          <ProFormText name="projectsort" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.projectsort', defaultMessage: '申请项目'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.projectsort.placeholder', defaultMessage: '请选择公司别'})}
                            fieldProps={{ value: projectsort }}/>  
                          <ProFormSelect.SearchSelect fieldProps={{ value: cachet}} width="sm" name="applyproject"
                              label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.applyproject', defaultMessage: '所需公章'})}
                              placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.applyproject.placeholder', defaultMessage: '请选择所需公章'})}
                              options={applyproject}
                              disabled={readOnly}
                          />
                          {/* <ProFormCheckbox.Group layout="horizontal" fieldProps={{value: cachet}} name="applyproject" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.applyproject', defaultMessage: '所需公章'})} options={applyproject}/>   */}
                          <ProFormSelect width="sm" fieldProps={{ value: kind, onChange: (e) => {getfile(e);} }} options={filekind} name="filekind"
                              label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.filekind', defaultMessage: '用印文件类型'})}
                              rules={[{ message: (<FormattedMessage  id="pages.finance.examine.applicationForm.printapply.filekind.require" defaultMessage="请选择用印文件类型!" />), }]}
                              placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.filekind.placeholder', defaultMessage: '请选择用印文件类型'})}
                              disabled={readOnly}
                              />
                          <ProFormSelect hidden={kindfileOnly} width="sm" fieldProps={{ value: file}} options={kindfile} name="kindfile"
                              label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.kindfile', defaultMessage: '用印文件'})}
                              rules={[{ message: (<FormattedMessage  id="pages.finance.examine.applicationForm.printapply.kindfile.require" defaultMessage="请选择用印文件!" />), }]}
                              placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.kindfile.placeholder', defaultMessage: '请选择用印文件'})}
                              disabled={readOnly}
                              />
                          <ProFormSelect.SearchSelect hidden={kindfilesOnly} fieldProps={{ value: files}} width="sm" name="kindfiles"
                              label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.kindfile', defaultMessage: '用印文件'})}
                              placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.kindfile.placeholder', defaultMessage: '请选择用印文件'})}
                              options={kindfiles}
                              disabled={readOnly}
                          />
                          
                          
                          <ProFormTextArea width="lg"  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.proinstruction', defaultMessage: '申请内容'})} disabled={readOnly} name="proinstruction" 
                          fieldProps={{ value: proinstruction }}/>
                          &nbsp;&nbsp;
                          <Upload {...props}>
                              <Button icon={<UploadOutlined />} disabled={readOnly} type="primary" style={{background:"green",borderRadius:"10px"}} >{intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.sumitAttach', defaultMessage: '上传附件'})}</Button>
                              <span style={{margin:'0 8px',color:'red'}}>{intl.formatMessage({ id: 'pages.finance.examine.applicationForm.printapply.annotation', defaultMessage: '注:请上传需求说明文件'})}</span>
                          </Upload>

                      </ProForm.Group>
                  </ProCard>   
                  
                  <ProCard style={{ width:'100%',marginTop:8 }}>
                                <Space style={{marginRight:24}}>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      actionRef.current?.addEditRecord?.({
                                        id: (Math.random() * 1000000).toFixed(0),
                                        title: '新的一行',
                                      });
                                    }}
                                  >
                                  <PlusOutlined />
                                    新建一行
                                  </Button>
                                </Space>
                          <EditableProTable<DataSourceType>
                              style={{marginTop:36 }}
                              rowKey="id"
                              actionRef={actionRef}
                              //headerTitle={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.summaryDetail', defaultMessage: '申请人'})}
                              value={AfuFormP26proposer}
                              onChange={setAfuFormP26proposer}
                              //scroll={{ x: 2000 }}  //橫向滑動
                              pagination={{ defaultPageSize: 5 }}
                              columns={columns}
                              // 关闭默认的新建按钮
                              recordCreatorProps={false}
                              
                              editable={{
                                form,
                                editableKeys,
                                onSave: async (key, row) => {
                                    await waitTime(2000);
                                    row.id = Date.now();
                                },
                                onChange: setEditableRowKeys,
                                actionRender: (row, config, dom) => [dom.save, dom.cancel],
                                }}
                              // recordCreatorProps={{
                              //     newRecordType: 'dataSource',
                              //     position: 'bottom',
                              //     record: () => ({
                              //         id: Date.now(),
                              //     }),
                              // }}
                              // editable={{
                              //     type: 'multiple',
                              //     editableKeys,
                              //     onChange: setEditableRowKeys,
                              //     actionRender: (row, _, dom) => {
                              //         return [dom.delete];
                              //     },

                              //     onValuesChange: (record, recordList) => {
                              //       setMaterialsDetail(recordList);
                              //   },
                              // }}
                              editable={{
                                form,
                                editableKeys,
                                onSave: async (key, row) => {
                                    await waitTime(2000);
                                    row.id = Date.now();
                                },
                                onChange: setEditableRowKeys,
                                actionRender: (row, config, dom) => [dom.save, dom.cancel],
                                }}
                          />
                        </ProCard>    
              </ProForm>
                              <OASignComponent
                                  initialValues={{
                                      //autoGenerateRefenceId: true,
                                      dictKey: dictKey,
                                      referenceId: referenceId,
                                      mode: mode,
                                      callBackUrl:"/finance/examine/applicationForm/printApply",
                                      category:"测试大类",
                                      subCategory:"测试小类",
                                      item:"测试细项",
                                  }}

                                  onCreate={
                                    {
                                        success: async (res) => {
                                            console.log("开单", res);
                                            message.success("开单成功!");
                                        },
                                        fail: async (res) => {
                                        }
                                    }
                                  }
                                  onApprove={
                                    {
                                        // validate: async (referenceId) => {
        
                                        // },
                                        success: async (data) => {
                                          console.log("签核成功", data);
                                          console.log(data[data.length-1].actualSignStatus);
                                          // for(let i=0;i<data.length;i++) {
                                          //   if(data[i].step == 2){
                                          //     changeState(referenceId);
                                          //   }
                                          // };
                                          // //签核完成时改变签核状态
                                          changeFlag(referenceId,"signed",data[data.length-1].actualSignComment);
                                        },
                                    }
                                  }
                                  onReject={
                                    {
                                        // validate: async (referenceId) => {
        
                                        // },
                                        success: async (data) => {
                                          console.log("驳回成功", data);
                                          console.log(data[data.length-1].actualSignStatus);
                                          changeFlag(referenceId,"reject",data[data.length-1].actualSignComment);
                                          // for(let i=0;i<data.length;i++) {
                                          //   if(data[i].step == 2 && data[i].actualSignStatus == 'R'){
                                          //     debugger;
                                          //     changeState(referenceId,data[i].actualSignComment);
                                          //   }
                                          // }
                                        },
                                    }
                                  }
                              >
                                
                              </OASignComponent>

              {/* </QueryFilter> */}

          </PageContainer>
      </div >
  )
}