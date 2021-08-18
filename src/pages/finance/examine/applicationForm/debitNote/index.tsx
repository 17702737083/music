import React, {  useEffect, useRef, useState  } from 'react';
import { message,Upload,Button,FormInstance,Descriptions,Space,Form} from 'antd';
import ProForm, { ProFormText,ProFormSelect,ProFormDatePicker,ProFormTextArea} from '@ant-design/pro-form';
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { initForm, saveDebitNote, changeState, changeFlag, getVendor } from '@/pages/finance/examine/applicationForm/debitNote/service';
import { queryCurrentUser } from '@/pages/system/service';
import { FormattedMessage, getLocale, setLocale, useIntl, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less';
import {DebitNoteParams, SysDebitNote, CompanyData, DataSourceType, currencys, exchangeRates, subject, vendor} from './data';
import OASignComponent from '@/components/OA/OASign';
import { OASignInitialProps } from '@/components/OA/OASign/data';
import moment from 'moment';
import UploadModalCandudate from '@/components/UploadModalCandidate';
import UploadModalCandudateAndRelease from '@/components/UploadModalCandidateAndRelease';
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';
import { List, values } from 'lodash';
import OAFileUpload, { UploadColumn } from '@/components/OA/OAFileUpload';

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

// const plant = [
//   { label: 'F741', value: 'F741' },
//   { label: 'F600', value: 'F600' },
// ];

// const companyCode = [
//   { label: 'WOK', value: 'WOK' },
//   { label: 'WKS', value: 'WKS' },
//   { label: 'WTZ', value: 'WTZ' },
// ];

// const companyName = [
//   { label: '纬视晶', value: '纬视晶' },
//   { label: '纬创昆山厂', value: '纬创昆山厂' },
//   { label: '纬创泰州厂 ', value: '纬创泰州厂' },
// ];

// const currencyList = [
//   { label: 'RMB', value: 'RMB' },
//   { label: 'USD', value: 'USD' },
//   { label: 'JPY', value: 'JPY' },
//   { label: 'EUR', value: 'EUR' },
//   //{ label: 'MYR', value: 'MYR' },
//   { label: 'NTD', value: 'NTD' },
// ];

const askWay = [
  { label: 'A. DEDUCT FROM OUTSTANDING PAYMENT.' +'\n\r' +
            'TOWISTRON(KUNSHAN)FINANCEDEPARTMENT:' +'\n\r' +
            'UPON RECEIPT OF THE RELATED DOCUMENT, PLS CONFIRM YOUR' +'\n\r' +
            'DISPOSITION, THKS. ', value: 'A' },
  { label: 'B. INTERNEDIARY BANK:' +'\n\r' +
            'SWIFT CODE:' +'\n\r' +
            'BENEFICIARY BANK:' +'\n\r' +
            'SWIFT CODE:' +'\n\r' +
            'BANK ADDRESS:' +'\n\r' +
            'BENEFICIARY: Object reference not set to an instance of an object.' +'\n\r' +
            'BENEFICIARY A/C NO:Object reference not set to an instance of an object.', value: 'B' },
];

const whcategory = [
  { label: 'casing', value: 'casing' },
  { label: 'external', value: 'external' },
  { label: 'Non-conforming', value: 'Non-conforming' },
  { label: 'PCBA', value: 'PCBA' },
  { label: 'Receiving', value: 'Receiving' },
];
const uploadColumns: UploadColumn[] = [
  { order: 1, key: "partno", title: "PartNO", sample: "1" },
  { order: 2, key: "customername", title: "CustomerName", sample: "ANNIE" },
  { order: 3, key: "profitcenter", title: "ProfitCenter", sample: "PCJ200" },
  { order: 4, key: "hscode", title: "HScode", sample: "2" },
  { order: 5, key: "importno", title: "ImportNo", sample: "3" },
  { order: 6, key: "po", title: "PO", sample: "4" },
  { order: 7, key: "line", title: "Line", sample: "5"},
  { order: 8, key: "gr", title: "GR", sample: "6" },
  { order: 9, key: "linegr", title: "LineGR", sample: "7" },
  { order: 10, key: "qty", title: "Qty", sample: "100" },
  { order: 11, key: "invoiceup", title: "InvoiceUP", sample: "0.3" },
  { order: 12, key: "rightup", title: "RightUP", sample: "0.2" },
  { order: 13, key: "chargeprice", title: "ChargePrice", sample: "0.10" },
  { order: 14, key: "amcount", title: "Amcount", sample: "10.00" }
];

const paid = [
  { label: 'Customer Paid', value: 'Customer Paid' },
  { label: 'Wistron Paid', value: 'Wistron Paid' },
];



export default () => {
  const actionRef = useRef<ActionType>();
  //const [submitting, setSubmitting] = useState(false);
  //const [debitNoteList, setDebitNoteList] = useState<SysDebitNote>({});
  //const [data, setData] = useState([]);
  const [referenceId, setReferenceId] = useState<string | undefined>("");
  const [dictKey, setDictKey] = useState("");
  const [mode, setMode] = useState<OASignInitialProps["mode"]>("edit");
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const [debitNoteParams, setDebitNoteParams]: any = useState<SysDebitNote>({});
  const [materialsDetail,setMaterialsDetail] = useState<DataSourceType[]>();
  // const [employeeInfoDTO, setemployeeInfoDTO] = useState({});
  // const [deptid, setdeptid] = useState('');

  const [applyid, setApplyid] = useState('');//工号
  const [applyname, setApplyname] = useState('');//姓名
  const [applyerdeptid, setApplyerdeptid ] = useState('');//部门
  const [applydatetime, setApplydatetime ] = useState('');//填单日期

  const [plant, setPlant] = useState<string | undefined>();//工厂別
  const [plantid, setPlantid] = useState<CompanyData[]>([]);//工厂別
  const [site, setSite] = useState<string | undefined>();//公司
  const [formsite, setFormsite] = useState<CompanyData[]>([]);//公司別
  const [companynamech, setCompanyNameCH] = useState('');//公司名称
  const [companyNameEN, setCompanyNameEN] = useState('');//公司英文名称

  const [wh, setWH] = useState<string | undefined>();//庫房
  const [whccategory, setWhcategory] = useState<string | undefined>();//庫房性質

  const [vendorcode, setVendorCode] = useState<string | undefined>();//供应商公司编号
  const [vendorname, setVendorName] = useState('');//供应商公司名称 

  const [origin, setOrigin] = useState<string | undefined>();//货币
  const [aim, setAim] = useState<string | undefined>();//货币
  const [origincurrency, setOrigincurrency] = useState<currencys[]>([]);//原始货币
  const [aimcurrency, setAimcurrency] = useState<currencys[]>([]);//目标货币
  const [exchangerate, setExchangerate] = useState("");//汇率
  const [subject, setSubject] = useState<subject[]>([]);//主题
  const [ssubject, setSsubject] = useState<string | undefined>();//主題
  const [paidby, setPaidby] = useState<string | undefined>();//支付方式
  const [paiddoc, setPaiddoc] = useState<string | undefined>();//支付金額
  const [askway, setAskway] = useState<string | undefined>();//請求方法
  const [lastremittancedate, setLastremittancedate] = useState<string | undefined>();//最後匯款日期
  const [remark, setRemark] = useState<string | undefined>();//合同備註說明

  const [chargeprices,setChargeprices] = useState<string | undefined>();
  const [amcounts,setAmcount] = useState<string | undefined>();
  const [id,setId] = useState<string>("123");

  const [form] = Form.useForm();
  const action = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const locale = getLocale(); 
 
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'PartNO',
      dataIndex: 'partno',
    },
    {
      title: 'CustomerName',
      dataIndex: 'customername',
      valueType: 'select',
      valueEnum: {
          ANNIE: {
            text: 'ANNIE',
          },
          ASTRO: {
            text: 'ASTRO',
          },
          BINA: {
            text: 'BINA',
          },
          COCO: {
            text: 'COCO',
          },
          GENERIC: {
            text: 'GENERIC',
          },
          HERCULES: {
            text: 'HERCULES',
          },
          JOAN: {
            text: 'JOAN',
          },
          KIMBERLEY: {
            text: 'KIMBERLEY',
          },
          LILY: {
            text: 'LILY',
          },
          MOTOTECH: {
            text: 'MOTOTECH',
          },
          PEARL: {
            text: 'PEARL',
          },
          ROSA: {
            text: 'ROSA',
          },
          SANDRA: {
            text: 'SANDRA',
          },
          SUSAN: {
            text: 'SUSAN',
          },
          TBD: {
            text: 'TBD',
          },
          TIGER: {
            text: 'TIGER',
          },
          Allie: {
            text: 'Allie',
          },
      },
    },
    {
      title: 'ProfitCenter',
      dataIndex: 'profitcenter',
      valueType: 'select',
      valueEnum: {
        PCJ200 : {
          text : 'PCJ200'
        },
        PCA000 : {
          text : 'PCA000'
        },
      },
    },
    {
      title: 'HScode',
      dataIndex: 'hscode',
    },
    {
      title: 'ImportNo',
      dataIndex: 'importno',
    },
    {
      title: 'PO',
      dataIndex: 'po',
    },
    {
      title: 'Line',
      dataIndex: 'line',
    },
    {
      title: 'GR',
      dataIndex: 'gr',
    },
    {
      title: 'LineGR',
      dataIndex: 'linegr',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
    },
    {
      title: 'InvoiceU/p',
      dataIndex: 'invoiceup',
    },
    {
      title: 'RightU/p',
      dataIndex: 'rightup',
    },
    {
      title: 'ChargePrice',
      dataIndex: 'chargeprice',     
      fieldProps: (from, { rowKey, rowIndex }) => {
        var chargeprice =(from.getFieldValue([rowKey || '', 'invoiceup'] ) - from.getFieldValue([rowKey || '', 'rightup'] )).toFixed(10);  
        chargeprice = parseFloat(chargeprice);
        if (!isNaN(chargeprice)) {
          setChargeprices(chargeprice)
          return {
            value: chargeprice,
            disabled: true
          }
        }
      },
    },
    {
      title: 'Amcount',
      dataIndex: 'amcount',
      fieldProps: (from, { rowKey, rowIndex }) => {
        let amcount = (chargeprices * from.getFieldValue([rowKey || '', 'qty'] )).toFixed(10);
        amcount = parseFloat(amcount);
        if (!isNaN(amcount)) {  
          setAmcount(amcount)   
          return {
            value: amcount,
            disabled: true
          }
        }
        return {};
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record, _, action) => [    
        console.log(record),    
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
        {intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.edit', defaultMessage: '编辑'})}  
        </a>,
        <a
          key="delete"
          onClick={() => {
            setMaterialsDetail(materialsDetail.filter((item) => item.id !== record.id));
          }}
        >
        {intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.delete', defaultMessage: '刪除'})}  
        </a>,
      ],
    },
  ];

  useEffect(async () => {
    const tempReferenceId = initialState?.getQueryString("referenceId");
    //获取url参数。更新referenceId的值。123
    setReferenceId(tempReferenceId ? tempReferenceId : undefined);
    setReadOnly(tempReferenceId ? true : false);
    if(tempReferenceId ? true : false) {
      const datas = await initForm(tempReferenceId);
      console.log(datas.data.materialsDetail, "DebitNoteParams");
      setDebitNoteParams(datas.data.afuFormP09f001)
      initbase(datas.data.afuFormP09f001);
      initmater(datas.data.materialsDetail);

    } else {
      selectop();
      getbase();
      getCompany();
      getcurrency();
      getsubject();
    }
  }, []);
  //初始化 厂别等
  const initbase = (datas) => {
    setApplyid(datas?.applyid);
    setApplyname(datas?.applyname);
    setApplyerdeptid(datas?.applyerdeptid);
    setApplydatetime(datas?.applydatetime);

    setSite(datas?.formsite);
    setPlant(datas?.plantid);
    setCompanyNameCH(datas?.companynamech);

    setWH(datas?.wh);
    setWhcategory(datas?.whcategory)

    setVendorCode(datas?.vendorcode)
    setVendorName(datas?.vendorname);

    setOrigin(datas?.origincurrency)
    setAim(datas?.aimcurrency);
    setExchangerate(datas?.exchangerate);

    setSsubject(datas?.subject);
    setPaidby(datas?.paidby);
    setPaiddoc(datas?.paiddoc);

    setLastremittancedate(datas?.lastremittancedate);
    setRemark(datas?.remark);

    setAskway(datas?.askway);
  }

  const initmater = (datas) => {
    setMaterialsDetail(datas);
  }

  const selectop = () => {
    //setOrigin("请选择原始货币");
  }

  //调用初始化查询
  const fetchRemoteData = async (params) => {
    return await queryDictDetail(params);
    };
  //获取公司别
  const getCompany = async () => {
    const data: any = await fetchRemoteData("finance.examine.companyCode");
    const dictList = data.data.list;
    let list: CompanyData[] = [];
    dictList.filter(item => item.dictValueSort !== 0)
      .forEach(item => {
          const valueObj = JSON.parse(item.dictValue as string);
          let Obj: CompanyData = {};
          Obj = valueObj.sapCompanyCode;
          list.push(Obj);
      })
      setFormsite(list);
      setCompanyNameCH('');
    };

  //根据公司别拉取厂别和公司名称
  const getFormsite = async (e: any) => {
    setPlant(null);
    const data: any = await fetchRemoteData("finance.examine.companyCode");
    const dictList = data.data.list;
    if(e != undefined) {
      if (!locale || locale === 'en-US') 
      {
        let companyNameCHObj = "";
        let list: CompanyData[] = [];
        dictList.filter(item => item.dictValueSort !== 0)
        .forEach(item => {
              const valueObj = JSON.parse(item.dictValue as string);
              if (valueObj.sapCompanyCode == e) {
                let Obj: CompanyData = {};
                Obj = valueObj.plantid;
                companyNameCHObj = valueObj.compantEnglishName;
                list.push(Obj);
              }
        })
        setPlantid(list);
        setCompanyNameCH(companyNameCHObj);
      } else {
        let companyNameCHObj = "";
        let list: CompanyData[] = [];
        dictList.filter(item => item.dictValueSort !== 0)
        .forEach(item => {
              const valueObj = JSON.parse(item.dictValue as string);
              if (valueObj.sapCompanyCode == e) {
              let Obj = valueObj.plantid;
              Obj = valueObj.plantid;
              companyNameCHObj = valueObj.compantChineseName;
              list.push(Obj);
              }
        })
        setPlantid(list);
        setCompanyNameCH(companyNameCHObj);
      }
    } else {
      getCompany();
    }
  };

  //获取币别
  const getcurrency = async () => {
    const data: any = await fetchRemoteData("finance.examine.currency");
    const dictList = data.data.list;
    let origincurrencylist: currencys[] = [];
    let aimcurrencylist: currencys[] = [];
    dictList.filter(item => item.dictValueSort !== 0)
      .forEach(item => {
          const valueObj = JSON.parse(item.dictValue as string);
          let origincurrencyObj: currencys = {};
          let aimcurrencyObj: currencys = {};
          origincurrencyObj = valueObj.currency;
          aimcurrencyObj = valueObj.currency;
          origincurrencylist.push(origincurrencyObj);
          aimcurrencylist.push(aimcurrencyObj);
      })
      setOrigincurrency(origincurrencylist);
      setAimcurrency(aimcurrencylist);
  }

  //根据原始货币和目标货币拉取汇率
  const getExchangeRate = async (aimcurrency: any) => {
    const data: any = await fetchRemoteData("finance.examine.exchangeRate");
    const dictList = data.data.list;
    if(aimcurrency != undefined) {
      dictList.filter(item => item.dictValueSort !== 0)
      .forEach(item => {
        const valueObj = JSON.parse(item.dictValue as string);
        if (valueObj.accountCurrency == origin && valueObj.changeCurrency == aimcurrency) {    
          setExchangerate(valueObj.exchangeRate);
          }
      })   
    } else {
      getcurrency();
    }
  };

  //获取主题
  const getsubject = async () => {
    const data: any = await fetchRemoteData("finance.examine.subject");
    const dictList = data.data.list;
    if (!locale || locale === 'en-US') 
      {
        let subjectlist: subject[] = [];
        dictList.filter(item => item.dictValueSort !== 0)
          .forEach(item => {
              const valueObj = JSON.parse(item.dictValue as string);
              let subjectObj: subject = {};
              subjectObj = valueObj.subjectUS;
              subjectlist.push(subjectObj);
          })
          setSubject(subjectlist);
      }else {
      let subjectlist: subject[] = [];
      dictList.filter(item => item.dictValueSort !== 0)
        .forEach(item => {
            const valueObj = JSON.parse(item.dictValue as string);
            let subjectObj: subject = {};
            subjectObj = valueObj.subject;
            subjectlist.push(subjectObj);
        })
        setSubject(subjectlist);
      } 
    // let subjectlist: subject[] = [];
    // dictList.filter(item => item.dictValueSort !== 0)
    //   .forEach(item => {
    //       const valueObj = JSON.parse(item.dictValue as string);
    //       let subjectObj: subject = {};
    //       subjectObj = valueObj.subject;
    //       subjectlist.push(subjectObj);
    //   })
    //   setSubject(subjectlist);
  }

  //获取人员信息
  const getbase = async () => {
    setApplyid(initialState?.currentUser?.employeeInfoDTO?.emplid);
    if (!locale || locale === 'en-US') 
      {     
        setApplyname(initialState?.currentUser?.employeeInfoDTO?.ename); 
      } else {    
        setApplyname(initialState?.currentUser?.employeeInfoDTO?.cname);
    }
    setApplyerdeptid(initialState?.currentUser?.employeeInfoDTO?.deptid);
    setApplydatetime(moment().format('YYYY-MM-DD HH:mm:ss'));
  }

  //获取供应商公司名称
  const getvendorname = async (vendorcode) => {
    const data = await getVendor(vendorcode);
    console.log(data,"vendor")
    if(data.data != null) {
      const name = data.data.vendorname;
      setVendorName(name);
    } else {
      setVendorName('');
    }

  }

  const intl = useIntl();
  const handleSubmit = async (list) => {
    //setSubmitting(true);
    try {
      // 送签
      const datas = await saveDebitNote(list);
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
      // 如果失败去设置用户错误信息
      //setDebitNoteList(datas);
      message.error('送簽失败,请重试！');
    } catch (error) {
      message.error('送簽失败,请重试！');
    }
    //setSubmitting(false);
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


  return (
    <div>
        <PageContainer>
            {/* <QueryFilter<{
                name: string;
                company: string;
            }>
                onFinish={async (values) => {
                    console.log(values.name);
                }}
            > */}
            <ProForm layout="horizontal"
        /*         submitter={{
                searchConfig: {
                    submitText: intl.formatMessage({
                    id: 'pages.login.submit',
                    defaultMessage: '登录',
                    }),
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                    loading: submitting,
                    size: 'large',
                    style: {
                    width: '100%',
                    },
                },
                }} */
                formRef={form}
                onFinish={async (values) => {
                    let list: any = {
                      DebitNoteParams: {},
                      MaterialsDetail: {},
                    };
                    values.applyid = applyid;
                    values.applyname = applyname;
                    values.applyerdeptid = applyerdeptid;
                    values.applydatetime = applydatetime;
                    //values.plantid = plantid;
                    values.companynamech = companynamech;
                    values.vendorname = vendorname;
                    values.exchangerate = exchangerate;
                    list.DebitNoteParams = values;
                    list.MaterialsDetail = materialsDetail;
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
                          <Descriptions.Item name="applyid" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.user', defaultMessage: '填单人'})}>{applyid}-{applyname}</Descriptions.Item>
                          <Descriptions.Item name="applyerdeptid" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.userDepartment', defaultMessage: '填單人部門'})}>{applyerdeptid}</Descriptions.Item>
                          <Descriptions.Item name="applydatetime" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.userSignDate', defaultMessage: '填單時間'})}>{applydatetime}</Descriptions.Item>
                        </Descriptions>
                        <ProFormSelect width="sm" fieldProps={{ value: site, onChange: (e) => {getFormsite(e);}}} options={formsite} name="formsite"
                            label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.conpanyType', defaultMessage: '公司别'})}
                            rules={[{ message: (<FormattedMessage  id="pages.finance.examine.applicationForm.debitnode.conpanyType.require" defaultMessage="请先选择公司别!" />), }]}
                            placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.conpanyType.placeholder', defaultMessage: '请先选择公司别'})}
                            disabled={readOnly}
                            />
                        <ProFormSelect width="sm" fieldProps={{ value: plant,onChange: (e) => {setPlant(e)}}} options={plantid} name="plantid"
                            label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.factoryType', defaultMessage: '工厂别'})}
                            rules={[{ message: (<FormattedMessage  id="pages.finance.examine.applicationForm.debitnode.conpanyType.require" defaultMessage="请先选择公司别!" />), }]}
                            placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.conpanyType.placeholder', defaultMessage: '请先选择公司别'})}
                            disabled={readOnly}
                            />                        
                            {/* <ProFormText name="plant" width="sm"  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.factoryType', defaultMessage: '工厂别'})} disabled  placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.conpanyType.placeholder', defaultMessage: '请选择公司别'})}
                            fieldProps={{ value: plant }} className='ProFormText'/> */}
                            <ProFormText name="companynamech" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.conpanyName', defaultMessage: '公司名称'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.conpanyType.placeholder', defaultMessage: '请选择公司别'})}
                            fieldProps={{ value: companynamech }}/>
                            {/* <ProFormSelect
                            width="sm"
                            options={formsite}
                            name="formsite"
                            label="公司别"
                            rules={[{ message: '请选择公司别!' }]}
                            // required={true}
                            placeholder='请选择公司别'
                            disabled={readOnly}
                            />
                            <ProFormSelect
                            width="sm"
                            options={companynamech}
                            name="companynamech"
                            label="公司名称"
                            rules={[{ message: '请选择公司名称!' }]}
                            // required={true}
                            placeholder='请选择公司名称'
                            disabled={readOnly}
                            /> */}
                            <ProFormText name="wh" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.wh', defaultMessage: 'W/H'})}  placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.wh.placeholder', defaultMessage: 'W/H'})} disabled={readOnly} 
                            fieldProps={{ value: wh }}/>
                            <ProFormSelect
                            width="sm"
                            options={whcategory}
                            name="whcategory"
                            label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.warehouseNature', defaultMessage: '库房性质'})}  placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.warehouseNature.placeholder', defaultMessage: '请选择库房性质'})}
                            rules={[{ message:  ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.warehouseNature.require" defaultMessage="请选择库房性质!" />)}]}
                            disabled={readOnly} fieldProps={{ value: whccategory }}
                            />  
                        <ProFormText name="vendorcode" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.supplierCompany', defaultMessage: '供应商公司'})}  disabled={readOnly} placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.supplierCompany.placeholder', defaultMessage: '请填写供应商公司'})}
                         fieldProps={{ onChange: (e) => {getvendorname(e.target.value)}, value: vendorcode }}/>
                        <ProFormText name="vendorname" width="sm"  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.supplierCompanyName', defaultMessage: '供应商公司名称'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.supplierCompany.placeholder', defaultMessage: '请先填写供应商公司'})}
                         fieldProps={{ value: vendorname }}/>
                        <ProFormSelect
                        width="sm"
                        fieldProps={{
                          value : origin,
                          onChange: (e) => {
                            //setDebitNoteParams({ ...debitNoteParams, origin: (e.value as string) });
                            setOrigin(e);
                          }
                        }}
                        options={origincurrency}
                        //initialValue={origin}

                        name="origincurrency"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.primitiveMoney', defaultMessage: '原始货币'})}
                        rules={[{ message:  ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.primitiveMoney.required" defaultMessage="请选择原始货币!"/>
                        ), }]}
                        // required={true}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.primitiveMoney.placeholder', defaultMessage: '请选择原始货币'})}
                        disabled={readOnly}
                        />
                        <ProFormSelect
                        width="sm"
                        fieldProps={{
                          value : aim,
                          onChange: (e) => {
                            getExchangeRate(e);
                          }
                        }}
                        options={aimcurrency}
                        name="aimcurrency"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.targetMoney', defaultMessage: '目标货币'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.targetMoney.required" defaultMessage="请选择目标货币!"/>)}]}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.targetMoney.placeholder', defaultMessage: '请选择目标货币'})}
                        disabled={readOnly}
                        />
                        {/* <Descriptions><Descriptions.Item label="汇率">{exchangerate}</Descriptions.Item></Descriptions> */}
                        <ProFormText name="exchangerate" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.exchangeRate', defaultMessage: '汇率'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.primitiveMoney.require', defaultMessage: '请先选择原始货币'})}
                        fieldProps={{ value: exchangerate }}/>

                        <ProFormSelect
                        options={subject}
                        fieldProps={{ value: ssubject }}
                        width="sm"
                        name="subject"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.subject', defaultMessage: '主题'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.subject.required" defaultMessage="请选择主题!"/> ), }]}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.subject.placeholder', defaultMessage: '请选择主题'})}
                        disabled={readOnly}
                        /> 
                        <ProFormSelect
                        width="sm"
                        options={paid}
                        fieldProps = {{value: paidby}}
                        name="paidby"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.paidby', defaultMessage: '支付方式'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.paidby.required" defaultMessage="请选择支付方式!"/>), }]}
                        // required={true}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.paidby.placeholder', defaultMessage: '请选择支付方式'})}
                        disabled={readOnly}
                        
                        />
                        <ProFormText name="paiddoc" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.paiddoc', defaultMessage: '支付金额'})} disabled={readOnly}placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.paiddoc.placeholder', defaultMessage: '请选择支付金额'})}
                        fieldProps={{ value: paiddoc }}/>
                        <ProFormSelect
                        width="sm"
                        options={askWay}
                        fieldProps = {{value: askway}}
                        name="askway"
                       label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.askway', defaultMessage: '请求方法'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.askway.required" defaultMessage="请选择请求方法!"/>), }]}
                        // required={true}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.askway.placeholder', defaultMessage: '请选择请求方法'})}
                        disabled={readOnly}
                        />
                        <ProFormDatePicker width="sm" name="lastremittancedate" disabled={readOnly}  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.lastRemittanceDate', defaultMessage: '最后汇款日期'})} 
                        fieldProps={{ value: lastremittancedate }}/>

                        <ProFormTextArea width="xl"  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.remark', defaultMessage: '合同备注说明'})} disabled={readOnly} name="remark" 
                        fieldProps={{ value: remark }}/>
                        &nbsp;&nbsp;
                        <Upload {...props}>
                            <Button icon={<UploadOutlined />} disabled={readOnly} type="primary" style={{background:"green",borderRadius:"10px"}} >{intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.sumitAttach', defaultMessage: '上传附件'})}</Button>{intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.annotation', defaultMessage: '(签呈/合同等)'})}
                        </Upload>

                    </ProForm.Group>
                </ProCard>   
                
                {/* <ProForm.Item
                    label="最终合计明细"
                    name="dataSource"
                    initialValue={defaultData}
                    trigger="onValuesChange"
                >
                </ProForm.Item> */}
                <ProCard style={{ width:'100%',marginTop:8 }}>
                <span className="spans" style={{marginLeft:24}} >
                  {intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.summaryDetail', defaultMessage: '材料部分'})}</span>
                        <Space className="spaces" style={{marginRight:24}}>
                            <Button
                            type="primary"
                            onClick={() => {
                                actionRef.current?.addEditRecord?.({
                                id: (Math.random() * 1000000).toFixed(),
                                title: '新的一行',
                                });
                            }}
                            >
                            <PlusOutlined />
                            {intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.spaces', defaultMessage: '新建一行'})}
                            </Button>
                            {/* <OAFileUpload
                            uploadColumns={uploadColumns}
                            showTabs={["excel"]}
                            referenceId={id}
                            mode="button"
                            onExcelFinish={{
                              success: async data => {
                                setMaterialsDetail(data)
                                console.log("received result from upload component", data)
                              }
                            }} /> */}
                        </Space>       
                        <EditableProTable<DataSourceType>
                            style={{marginTop:16 }}
                            rowKey="id"
                            name = "materialsDetail"
                            actionRef={actionRef}
                            //headerTitle={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.summaryDetail', defaultMessage: '材料部分'})}
                            value={materialsDetail}
                            onChange={setMaterialsDetail}
                            scroll={{ x: 2000 }}  //橫向滑動
                            //toolBarRender={() => [
                              // <Button
                              //   type="primary"
                              //   onClick={() => {
                              //     actionRef.current?.addEditRecord?.({
                              //       newRecordType: 'dataSource',
                              //       record: () => ({
                              //         id: Date.now(),
                              //       }),
                              //       //title: '新的一行',
                              //     });
                              //   }}
                              // >
                              //   <PlusOutlined />
                              //   新建一行
                              // </Button>,
                              // <Upload>
                              //   <Button style={{margin:'0 10px'}} icon={<UploadOutlined /> } type="primary">批量匯入</Button>
                              // </Upload>,
                              // <Button key="add" type="primary" onClick={() => {
                              //   handleExportExcel(formRef.current?.getFieldsValue());
                              // }} style={{margin:'0 10px'}}>
                              // 確定上傳{/* {batchUpload ? 'Uploading' : 'Uploading'} */}
                              // </Button>,
                              //<UploadModalCandudate/>,
                              //<UploadModalCandudateAndRelease/>
                            //]}
                            pagination={{ defaultPageSize: 5 }}
                            columns={columns}
                            // 关闭默认的新建按钮
                            recordCreatorProps={false}
                            // recordCreatorProps={{
                            //     newRecordType: 'dataSource',
                            //     position: 'bottom',
                            //     record: () => ({
                            //         id: Date.now(),
                            //     }),
                            // }}
                            request={(params, sorter, filter) => {
                              // 表单搜索项会从 params 传入，传递给后端接口。
                              console.log(params, sorter, filter);
                              return Promise.resolve({
                                  data: materialsDetail,
                                  success: true
                              });
                            }}
                            editable={{
                              form,
                              editableKeys,
                              onSave: async (key, row) => {
                                  await waitTime(2000);
                                  if(amcounts != '' && amcounts != undefined) {
                                    row.chargeprice = chargeprices;
                                    row.amcount = amcounts; 
                                    row.id = Date.now();
                                  } else {
                                    row.chargeprice = row.chargeprice;
                                    row.amcount = row.amcount;
                                    row.id = Date.now(); 
                                  }
                              },
                              onChange: setEditableRowKeys,
                              actionRender: (row, config, dom) => [dom.save, dom.cancel],
                              }}
                            // editable={{
                            //     type: 'multiple',
                            //     editableKeys,
                            //     onChange: setEditableRowKeys,
                            //     actionRender: (row, _, dom) => {
                            //         return [dom.delete];
                            //     },

                            //     onSave: async () => {
                            //       await waitTime(2000);
                            //     },
                            //     onValuesChange: (record, recordList) => {
                            //       setMaterialsDetail(recordList);
                            //   },
                            // }}
                          //   request={(params, sorter, filter) => {
                          //     // 表单搜索项会从 params 传入，传递给后端接口。
                          //     console.log(params, sorter, filter);
                          //     return Promise.resolve({
                          //         data: materialsDetail,
                          //         success: true,
                          //     });
                          // }}
                        />
                      </ProCard>    
            </ProForm>
                            <OASignComponent
                                initialValues={{
                                    //autoGenerateRefenceId: true,
                                    dictKey: dictKey,
                                    referenceId: referenceId,
                                    mode: mode,
                                    callBackUrl:"/finance/examine/applicationForm/debitNote",
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
                                        //签核完成时改变签核状态
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

