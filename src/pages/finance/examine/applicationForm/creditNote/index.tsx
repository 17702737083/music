import React, {  useEffect, useRef, useState  } from 'react';
import { message,Upload,Button,FormInstance,Descriptions,Space,Form} from 'antd';
import ProForm, { ProFormText,ProFormSelect,ProFormDatePicker,ProFormTextArea} from '@ant-design/pro-form';
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { initForm, saveCreditNote, changeState, changeFlag } from './service';
import { queryCurrentUser } from '@/pages/system/service';
import { FormattedMessage, getLocale, useIntl, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import './index.less';
import {CreditNoteParams, SysCreditNote, CompanyData, DataSourceType, currencys, exchangeRates, subject, vendor} from './data';
import OASignComponent from '@/components/OA/OASign';
import { OASignInitialProps } from '@/components/OA/OASign/data';
import moment from 'moment';
import UploadModalCandudate from '@/components/UploadModalCandidate';
import UploadModalCandudateAndRelease from '@/components/UploadModalCandidateAndRelease';
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';
import { List } from 'lodash';
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

const uploadColumns: UploadColumn[] = [
  { order: 1, key: "partno", title: "PartNO", sample: "1" },
  { order: 2, key: "customername", title: "CustomerName", sample: "ANNIE" },
  { order: 3, key: "profitcenter", title: "ProfitCenter", sample: "PCJ200" },
  { order: 4, key: "importno", title: "ImportNo", sample: "2" },
  { order: 5, key: "po", title: "PO", sample: "3" },
  { order: 6, key: "line", title: "Line", sample: "4"},
  { order: 7, key: "gr", title: "GR", sample: "5" },
  { order: 8, key: "linegr", title: "LineGR", sample: "6" },
  { order: 9, key: "qty", title: "Qty", sample: "100" },
  { order: 10, key: "invoiceup", title: "InvoiceUP", sample: "0.3" },
  { order: 11, key: "rightup", title: "RightUP", sample: "0.2" },
  { order: 12, key: "chargeprice", title: "ChargePrice", sample: "0.10" },
  { order: 13, key: "amcount", title: "Amcount", sample: "10.00" }
];
const paid = [
  { label: 'Customer Paid', value: 'Customer Paid' },
  { label: 'Wistron Paid', value: 'Wistron Paid' },
];



export default () => {
  const actionRef = useRef<ActionType>();

  const [referenceId, setReferenceId] = useState<string | undefined>("");
  const [dictKey, setDictKey] = useState("");
  const [mode, setMode] = useState<OASignInitialProps["mode"]>("edit");
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const [creditNoteParams, setCreditNoteParams]: any = useState<SysCreditNote>({});
  const [materialsDetail,setMaterialsDetail] = useState<DataSourceType[]>();
  // const [employeeInfoDTO, setemployeeInfoDTO] = useState({});
  // const [deptid, setdeptid] = useState('');

  const [applyid, setApplyid] = useState('');//工号
  const [applyname, setApplyname] = useState('');//姓名
  const [applyerdeptid, setApplyerdeptid ] = useState('');//部门
  const [applydatetime, setApplydatetime ] = useState('');//填单日期

  const [plant, setPlant] = useState<CompanyData[]>([]);//工厂別
  const [plantid, setPlantid] = useState<string | undefined>();//工厂
  const [companynamech, setCompanyNameCH] = useState('');//公司名称
  const [companyNameEN, setCompanyNameEN] = useState('');//公司英文名称

  const [vendorcode, setVendorCode] = useState<string | undefined>();//供应商公司编号
  const [vendorname, setVendorName] = useState('');//供应商公司名称 

  const [origin, setOrigin] = useState<string | undefined>();//货币
  const [aim, setAim] = useState<string | undefined>();//货币
  const [origincurrency, setOrigincurrency] = useState<currencys[]>([]);//原始货币
  const [aimcurrency, setAimcurrency] = useState<currencys[]>([]);//目标货币
  const [exchangerate, setExchangerate] = useState("");//汇率

  const [subject, setSubject] = useState<string | undefined>();//主題
  const [offsetdno, setOffsetdno] = useState<string | undefined>();//主題  
  const [paidby, setPaidby] = useState<string | undefined>();//支付方式
  const [paiddoc, setPaiddoc] = useState<string | undefined>();//支付金額
  const [lastremittancedate, setLastremittancedate] = useState<string | undefined>();//最後匯款日期
  const [remark, setRemark] = useState<string | undefined>();//合同備註說明

  const [chargeprices,setChargeprices] = useState<string | undefined>();
  const [amcounts,setAmcount] = useState<string | undefined>();

  const [form] = Form.useForm();
  const action = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const locale = getLocale(); 

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
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
        }
      },
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
        let chargeprice = (from.getFieldValue([rowKey || '', 'invoiceup'] ) - from.getFieldValue([rowKey || '', 'rightup'] )).toFixed(10);
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
        console.log(amcount,'33333333333')
        if (!isNaN(amcount)) {     
          setAmcount(amcount) 
          return {
            value: amcount,
            disabled: true,
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
      console.log(datas.data.materialsDetail, "CreditNoteParams");
      setCreditNoteParams(datas.data.afuFormP09f002)
      initbase(datas.data.afuFormP09f002);
      initmater(datas.data.materialsDetail);
    } else {
      selectop();
      getbase();
      getCompany();
      getcurrency();
    }
  }, []);



  //初始化 厂别等
  const initbase = (datas) => {
    setApplyid(datas?.applyid);
    setApplyname(datas?.applyname);
    setApplyerdeptid(datas?.applyerdeptid);
    setApplydatetime(datas?.applydatetime);
    
    setPlantid(datas?.plantid);
    setCompanyNameCH(datas?.companynamech);

    setVendorCode(datas?.vendorcode)
    setVendorName(datas?.vendorname);

    setOrigin(datas?.origincurrency)
    setAim(datas?.aimcurrency);
    setExchangerate(datas?.exchangerate);

    setSubject(datas?.subject);
    setOffsetdno(datas?.offsetdno);
    setPaidby(datas?.paidby);
    setPaiddoc(datas?.paiddoc);

    setLastremittancedate(datas?.lastremittancedate);
    setRemark(datas?.remark);

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
  //获取工厂别
  const getCompany = async () => {
    const data: any = await fetchRemoteData("finance.examine.companyCode");
    const dictList = data.data.list;
    let list: CompanyData[] = [];
    dictList.filter(item => item.dictValueSort !== 0)
      .forEach(item => {
          const valueObj = JSON.parse(item.dictValue as string);
          let Obj: CompanyData = {};
          Obj = valueObj.plantid;
          list.push(Obj);
      })
      setPlant(list);
      setCompanyNameCH('');
    };

  //根据工厂别拉取公司名称
  const getCompanynamech = async (plantid: any) => {
    const data: any = await fetchRemoteData("finance.examine.companyCode");
    const dictList = data.data.list;
    if(plantid != undefined) {
      if (!locale || locale === 'en-US') 
      {
        dictList.filter(item => item.dictValueSort !== 0)
        .forEach(item => {
              const valueObj = JSON.parse(item.dictValue as string);
              if (valueObj.plantid == plantid) {
              let companyNameCHObj = valueObj.compantEnglishName;
              setCompanyNameCH(companyNameCHObj);
              }
        })
      } else {
        dictList.filter(item => item.dictValueSort !== 0)
        .forEach(item => {
              const valueObj = JSON.parse(item.dictValue as string);
              if (valueObj.plantid == plantid) {
              let companyNameCHObj = valueObj.compantChineseName;
              setCompanyNameCH(companyNameCHObj);
              }
        })
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
    const data: any = await fetchRemoteData("finance.examine.vendor");
    const dictList = data.data.list;
    if(vendorcode != undefined) {
      dictList.filter(item => item.dictValueSort !== 0)
      .forEach(item => {
        const valueObj = JSON.parse(item.dictValue as string);
        if (valueObj.vendorCode == vendorcode) {    
          setVendorName(valueObj.vendorName);
          }
      })   
    } else {
      setVendorName('');
    }

  }

  const intl = useIntl();
  const handleSubmit = async (list) => {
    //setSubmitting(true);
    try {
      // 送签
      const datas = await saveCreditNote(list);
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
            <ProForm layout="horizontal"
                onFinish={async (values) => {
                    console.log(materialsDetail,"materialsDetail");
                    let list: any = {
                      CreditNoteParams: {},
                      MaterialsDetail: {},
                    };
                    values.applyid = applyid;
                    values.applyname = applyname;
                    values.applyerdeptid = applyerdeptid;
                    values.applydatetime = applydatetime;
                    values.companynamech = companynamech;
                    values.vendorname = vendorname;
                    values.exchangerate = exchangerate;
                    list.CreditNoteParams = values;
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
                          <Descriptions.Item name="applyid" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.user', defaultMessage: '填单人'})}>{applyid}-{applyname}</Descriptions.Item>
                          <Descriptions.Item name="applyerdeptid" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.userDepartment', defaultMessage: '填單人部門'})}>{applyerdeptid}</Descriptions.Item>
                          <Descriptions.Item name="applydatetime" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.userSignDate', defaultMessage: '填單時間'})}>{applydatetime}</Descriptions.Item>
                        </Descriptions>
                        <ProFormSelect width="sm" fieldProps={{ value: plantid, onChange: (e) => {getCompanynamech(e)}}} options={plant} name="plantid"
                            label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.factoryType', defaultMessage: '工厂别'})}
                            rules={[{ message: (<FormattedMessage  id="pages.finance.examine.applicationForm.creditnode.factoryType.require" defaultMessage="请先选择工厂别!" />), }]}
                            placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.factoryType.placeholder', defaultMessage: '请先选择工厂别'})}
                            disabled={readOnly}
                            />
                        <ProFormText name="companynamech" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.conpanyName', defaultMessage: '公司名称'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.factoryType.placeholder', defaultMessage: '请先选择工厂别'})}
                        fieldProps={{ value: companynamech }}/> 
                        <ProFormText name="vendorcode" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.supplierCompany', defaultMessage: '供应商公司'})}  disabled={readOnly} placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.supplierCompany.placeholder', defaultMessage: '请填写供应商公司'})}
                         fieldProps={{ onChange: (e) => {getvendorname(e.target.value)}, value: vendorcode }}/>
                        <ProFormText name="vendorname" width="sm"  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.supplierCompanyName', defaultMessage: '供应商公司名称'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.supplierCompany.placeholder', defaultMessage: '请先填写供应商公司'})}
                         fieldProps={{ value: vendorname }}/>
                        <ProFormSelect
                        width="sm"
                        fieldProps={{
                          value : origin,
                          onChange: (e) => {
                            //setCreditNoteParams({ ...debitNoteParams, origin: (e.value as string) });
                            setOrigin(e);
                          }
                        }}
                        options={origincurrency}
                        name="origincurrency"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.primitiveMoney', defaultMessage: '原始货币'})}
                        rules={[{ message:  ( <FormattedMessage id="pages.finance.examine.applicationForm.creditnode.primitiveMoney.required" defaultMessage="请选择原始货币!"/>
                        ), }]}
                        // required={true}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.primitiveMoney.placeholder', defaultMessage: '请先选择原始货币'})}
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
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.targetMoney', defaultMessage: '目标货币'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.creditnode.targetMoney.required" defaultMessage="请选择目标货币!"/>)}]}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.targetMoney.placeholder', defaultMessage: '请选择目标货币'})}
                        disabled={readOnly}
                        />
                        {/* <Descriptions><Descriptions.Item label="汇率">{exchangerate}</Descriptions.Item></Descriptions> */}
                        <ProFormText name="exchangerate" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.exchangeRate', defaultMessage: '汇率'})} disabled placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.primitiveMoney.require', defaultMessage: '请先选择原始货币'})}
                        fieldProps={{ value: exchangerate }}/>

                        <ProFormSelect
                        width="sm"
                        options={paid}
                        fieldProps = {{value: paidby}}
                        name="paidby"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.paidby', defaultMessage: '支付方式'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.creditnode.paidby.required" defaultMessage="请选择支付方式!"/>), }]}
                        // required={true}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.paidby.placeholder', defaultMessage: '请选择支付方式'})}
                        disabled={readOnly}
                        
                        />
                        <ProFormText name="paiddoc" width="sm" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.paiddoc', defaultMessage: '支付金额'})} disabled={readOnly}placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.paiddoc.placeholder', defaultMessage: '请输入支付金额'})}
                        fieldProps={{ value: paiddoc }}/>
                        <ProFormDatePicker width="sm" name="lastremittancedate" disabled={readOnly}  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.lastRemittanceDate', defaultMessage: '最后汇款日期'})} 
                        fieldProps={{ value: lastremittancedate }}/>

                        {/* <ProFormSelect
                        options={subject}
                        fieldProps={{ value: ssubject }}
                        width="sm"
                        name="subject"
                        label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.subject', defaultMessage: '主题'})}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.debitnode.subject.required" defaultMessage="请选择主题!"/> ), }]}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.subject.placeholder', defaultMessage: '请选择主题'})}
                        disabled={readOnly}
                        />  */}
                        <ProFormText name="subject" width="xl" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.subject', defaultMessage: '主题'})} disabled={readOnly}
                        rules={[{ message: ( <FormattedMessage id="pages.finance.examine.applicationForm.creditnode.subject.required" defaultMessage="请填写主题!"/> ), }]}
                        placeholder={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.subject.placeholder', defaultMessage: '请输入主题'})}
                        fieldProps={{ value: subject }}/>
                        <ProFormText name="offsetdno" width="xl" label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.offsetdno', defaultMessage: '原扣款单'})} disabled={readOnly}
                        fieldProps={{ value: offsetdno }}/><span className="spanWarn">{intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.annotation', defaultMessage: '若此付款申請是用于补还或冲销扣款,請在此填写原扣款Invoice(Debit) No'})}</span>
                        <ProFormTextArea width="xl"  label={intl.formatMessage({ id: 'pages.finance.examine.applicationForm.creditnode.remark', defaultMessage: '合同备注说明'})} disabled={readOnly} name="remark" 
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
                        <span className="spans" style={{marginLeft:24}}>
                        {intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.summaryDetail', defaultMessage: '材料部分'})}
                        </span>
                        <Space className="spaces" style={{marginRight:24}}>
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
                            {intl.formatMessage({ id: 'pages.finance.examine.applicationForm.debitnode.spaces', defaultMessage: '新建一行'})}
                            </Button>
                            {/* <OAFileUpload
                            uploadColumns={uploadColumns}
                            onFinish={{
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
                              // <Upload>
                              //   <Button style={{margin:'0 10px'}} icon={<UploadOutlined /> } type="primary">批量匯入</Button>
                              // </Upload>,
                              // <Button key="add" type="primary" onClick={() => {
                              //   handleExportExcel(formRef.current?.getFieldsValue());
                              // }} style={{margin:'0 10px'}}>
                              // 確定上傳{/* {batchUpload ? 'Uploading' : 'Uploading'} */}
                              // </Button>,
                              
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
                                  success: true,
                              });
                            }}
                            editable={{
                            form,
                            editableKeys,
                            onSave: async (key, row) => {
                              await waitTime(2000);
                              // console.log(amcounts,'222222222')
                              // debugger
                              if(amcounts != '' && amcounts != undefined) {
                                row.chargeprice = chargeprices;
                                row.amcount = amcounts; 
                                row.id = Date.now();
                                // setChargeprices(undefined);
                                // setAmcount(undefined);
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
                            //}}
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
                                    callBackUrl:"/finance/examine/applicationForm/creditNote",
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

