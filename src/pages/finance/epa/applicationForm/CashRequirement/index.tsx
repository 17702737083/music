import React, { useEffect, useRef, useState } from 'react'
import ProForm, {
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormDigit,
    ModalForm,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal, notification, Select, Upload } from 'antd';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import Icon, { ConsoleSqlOutlined, UploadOutlined } from '@ant-design/icons';
import './index.less';
import * as xlsx from 'xlsx';
import { AbstractRuleData, AreaSource, AreaTypesData, CompanyData, CompanySource, CostAccountantCourseSource, CostRulesData, CostRulesSource, CurrencySource, EmployeeTypeSource, EstimateApportionMainSource, invoiceParam, OptionsData, ProfitCenterSource, SummaryRuleSource, VendorSourceType } from '../../data';
import { useIntl } from '@/.umi/plugin-locale/localeExports';
import { findAllCompany } from '../../epaBaseData/Company/service';
import { findAllVendor } from '../../epaBaseData/Vendor/service';
import { findAllCostRules } from '../../ruleBaseData/CostRules/service';
import { useModel } from 'umi';
import { getArrayIndex, getPageQuery, getUrl } from '../../util';
import { changeCashState, createSignFlow, findAllByCrdateBy, findCcurrateByCcurfrom, getBalance, getCostRule, getDifferenceDetail, getInvoiceList, getPaymentDate, getSummaryRule, getTotalMoney, initForms, saveCashRequirement } from './service';
import { TableListItem } from '@/pages/it/basedata/kanban/data';
import { findAllCurrency } from '../../epaBaseData/Currency/service';
import { changeState, detailedSummary, downloadTemplate, findAreaList, findDept2, findSummaryRuleList } from '../CostEstimateApportion/service';
import ProCard from '@ant-design/pro-card';
import { findAllSummaryRule } from '../../ruleBaseData/SummaryRule/service';
import { findAllArea } from '../../epaBaseData/Area/service';
import { findAllEmployeeType } from '../../epaBaseData/EmployeeType/service';
import { findAllProfitCenter } from '../../epaBaseData/ProfitCenter/service';
import { epaServiceUrl } from '@/components/OA/serviceUrl';
import OAFileUpload from '@/components/OA/OAFileUpload';
import OASignComponent from '@/components/OA/OASign';
import { findAllCostAccountantCourse } from '../../epaBaseData/CostAccountantCourse/service';
import { Color } from 'bizcharts/lib/plots/core/dependents';


//请款冲销单 

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
    {
        id: 624748504,
        title: '',
        decs: '',
        state: '',
        created_at: '',
    },
];




const invoiceTypeList = [
    { label: '增值税发票', value: '增值税发票' },
    { label: '财政收据', value: '财政收据' },
    { label: '国外Invoice', value: '国外Invoice' },
];
const billtype = [
    { label: '申請付款', value: '申請付款' },
    { label: '沖借款', value: '沖借款' },
];

const invoiceTypes = [
    { label: '增值税专用发票', value: '增值税专用发票' },
    { label: '增值税普通发票', value: '增值税普通发票' },
    { label: '增值税电子普通发票', value: '增值税电子普通发票' },
];

//请款冲销单 

const CashRequirement: React.FC = () => {

    const columnsInvoicePool = [
        {
            title: '发票类别',
            dataIndex: 'invtype',
            width: 200,
            valueType: 'text',
            search: false,
        },
        {
            title: '批量上傳號碼',
            dataIndex: 'batchno',
            width: 200,
            valueType: 'text',
            search: false,
        },
        {
            title: '发票代码',
            dataIndex: 'invcode',
            width: 200,
            valueType: 'text',

        },
        {
            title: '发票号码',
            dataIndex: 'invno',
            width: 200,
            valueType: 'text',
        },
        {
            title: '发票日期',
            dataIndex: 'invdate',
            width: 200,
            valueType: 'datetime',
            search: false,
        },
        {
            title: '銷售方稅號',
            dataIndex: 'salestaxno',
            width: 200,
            valueType: 'text',
            search: false,
        },
        {
            title: '不含稅金額',
            dataIndex: 'amount',
            width: 200,
            valueType: 'text',
            search: false,
        },
        {
            title: '税额',
            dataIndex: 'taxamount',
            width: 200,
            valueType: 'text',
            search: false,
        },
        {
            title: '合计金额',
            dataIndex: 'tlprice',
            width: 200,
            valueType: 'text',
            search: false,
        },
    ];
    const invoiceColumns = [
        {
            title: '发票类别',
            key: 'invoiceType',
            dataIndex: 'invoiceType',
            width: 200,
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                invoiceTypes.forEach((item: any) => {
                    options[item.value] = item.label
                });
                return options;
            },
        },
        {
            title: '发票代码',
            dataIndex: 'invoiceCode',
            width: 150,
            valueType: 'text',
        },
        {
            title: '发票号码',
            dataIndex: 'invoiceNumber',
            width: 150,
            valueType: 'text',
        },
        {
            title: '发票日期',
            width: 150,
            dataIndex: 'invoiceDate',
            valueType: 'date',
        },
        {
            title: '不含税金额',
            width: 150,
            dataIndex: 'noTaxMoney',
            valueType: 'text',
        },
        {
            title: '税率',
            width: 150,
            dataIndex: 'taxRate',
            valueType: 'text',
        },
        {
            title: '税额',
            width: 150,
            dataIndex: 'taxLimit',
            valueType: 'text',
        },
        {
            title: '合计金额',
            width: 150,
            dataIndex: 'amount',
            valueType: 'text',
        },
        {
            title: '外币金额',
            width: 150,
            valueType: 'text',
            ellipsis: true,
            editable: false,
            dataIndex: 'foreignCurrencyMoney',
            render: (text, record, index) => {
                let value = 0;
                if (record.amount !== '' || record.amount !== undefined) {
                    value = Number(Number((record.amount) / currate).toFixed(2));
                }
                console.log(value, "value");
                return <span >{value}</span>
            }
        },
        {
            title: '调整不含税金额',
            width: 150,
            dataIndex: 'noTaxMoneyT',
            valueType: 'text',
        },
        {
            title: '调整税额',
            width: 100,
            dataIndex: 'taxLimitT',
            valueType: 'text',
        },
        {
            title: '调整合计金额',
            width: 120,
            dataIndex: 'amountT',
            valueType: 'text',
        },
        {
            title: '操作',
            valueType: 'option',
            fixed: 'right',
            render: (text: any, record: any, _: any, action: any) => [
                <a
                    key="editable"
                    onClick={() => {
                        console.log("dianji");
                        action?.startEditable?.(record.guId);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setInvoiceSource(invoiceSource.filter((item: any) => item.guId !== record.guId));
                    }}
                >
                    {/* 删除 */}
                </a>,
                <ModalForm
                    title="调整金额"
                    width={50 + '%'}
                    trigger={<Button type="link" onClick={async () => {
                        // console.log(row.formId, "---------------------------------------------");
                        // //接收两个参数，1，签核流程key，（truck.uploadTruckInfoSignFlow）2，单号(WKS202105080000142465)
                        // const result: any = await getSignRecordListByReferenceId(row.formId);
                        // // const result = await generateSignRecordListByDictKey("truck.uploadTruckInfoSignFlow", "WKS202105080000142465");
                        // console.log(result);
                        // if (result.errorCode == 0) {
                        //     if (result.data && result.data.list.length > 0) {
                        //         setSignRecordDTOList(result.data.list as SignRecordDTO[]);
                        //     }
                        // } else {
                        //     message.error(result.errorMessage);
                        // }
                    }}>调整金额</Button>}
                    submitter={{
                        submitButtonProps: {
                            style: {
                                display: 'none',
                            },
                        },

                    }}
                    onFinish={async (values) => {
                        console.log(values);
                        message.success('提交成功');
                        return true;
                    }}

                >
                    <ProForm layout="horizontal"
                        onFinish={async (value) => {

                        }}
                        submitter={{
                            render: (props, doms) => {
                                return [
                                    <Button type="primary" key="submit" style={{ marginRight: 10 }} onClick={() => {
                                        props.form?.submit?.()
                                    }}>
                                        保存
                                    </Button>,
                                ];
                            },
                        }}
                    >
                        <ProForm.Group>
                            <ProFormText
                                width="sm"
                                name="noTaxMoneyT"
                                label="不含税金额"
                                placeholder='不含税金额'
                                fieldProps={{
                                    onChange: (e) => {
                                        console.log();
                                    }
                                }}

                            />
                            <ProFormText
                                width="sm"
                                name="taxLimitT"
                                label="税额"
                                placeholder='税额'
                                fieldProps={{
                                    onChange: (e) => {
                                        console.log();
                                    }
                                }}

                            />
                            <ProFormText
                                width="sm"
                                name="amountT"
                                label="合计金额"
                                placeholder='合计金额'
                                fieldProps={{
                                    onChange: (e) => {
                                        console.log();
                                    }
                                }}

                            />
                        </ProForm.Group>
                    </ProForm>
                    {/* <EditableProTable columns={columnAdjust} dataSource={signRecordDTOList}
                /> */}
                </ModalForm>,
            ],
        },

    ];

    const columnAdjust = [
        {
            title: '',
            // width: '40%',
            dataIndex: 'noTaxMoneyT',
            valueType: 'text',
        },
        {
            title: '税额',
            // width: '40%',
            dataIndex: 'taxLimitT',
            valueType: 'text',
        },
        {
            title: '合计金额',
            // width: '40%',
            dataIndex: 'amountT',
            valueType: 'text',
        },
    ];

    const fiscalReceiptColumns = [
        {
            title: '发票类别',
            key: 'invoiceType',
            dataIndex: 'invoiceType',
            width: '15%',
            valueType: 'text',
            fieldProps: {
                value: '国内收据',
            },
        },
        {
            title: '发票号码',
            dataIndex: 'invoiceNumber',
        },
        {
            title: '发票日期',
            dataIndex: 'invoiceDate',
            valueType: 'date',
        },
        {
            title: '合计金额',
            // width: '40%',
            dataIndex: 'amount',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text: any, record: any, _: any, action: any) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.guId);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setFiscalReceiptSource(fiscalReceiptSource.filter((item: any) => item.guId !== record.guId));
                    }}
                >
                    删除
                </a>,
            ],
        },

    ];
    const foreignInvoiceColumns = [
        {
            title: '发票类别',
            key: 'invoiceType',
            dataIndex: 'invoiceType',
            width: '15%',
            valueType: 'text',
            fieldProps: {
                value: '国外Invoice',
            },
        },
        {
            title: '发票号码',
            dataIndex: 'invoiceNumber',
        },
        {
            title: '发票日期',
            dataIndex: 'invoiceDate',
            valueType: 'date',
        },
        {
            title: '外币金额',
            // width: '40%',
            dataIndex: 'foreignMoney',
            fieldProps: {
                // value: '国外Invoice',
                onChange: (e) => {
                    console.log(e, "e");
                }
            },
        },
        {
            title: '折算RMB金额',
            // width: '40%',
            dataIndex: 'convertRmbMoney',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text: any, record: any, _: any, action: any) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.guId);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setForeignInvoiceSource(foreignInvoiceSource.filter((item: any) => item.guId !== record.guId));
                    }}
                >
                    删除
                </a>,
            ],
        },

    ];
    const columns = [
        {
            title: '部门代码',
            dataIndex: 'departmentId',
            width: '15%',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        whitespace: true,
                        message: '此项是必填项',
                    },
                ],
            },
        },
        {
            title: '区域',
            key: 'areaName',
            dataIndex: 'areaName',
            width: '15%',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                areaTypesList.forEach((item: any) => {
                    options[item.areaName] = item.areaName
                });
                return options;
            },
        },
        {
            title: '员工类型',
            dataIndex: 'employeeType',
            width: '15%',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                employeeTypeList.forEach((item: any) => {
                    options[item.value] = item.label
                });
                return options;
            },

        },
        {
            title: '績效調整掛帳部門',
            width: '15%',
            dataIndex: 'buyerDepartment',
        },
        {
            title: 'BU代碼(Profit center)',
            dataIndex: 'buId',
            width: '15%',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                buList.forEach((item: any) => {
                    options[item.value] = item.label
                });
                return options;
            },
        },
        {
            title: '金额',
            width: '15%',
            dataIndex: 'money',
        },
        {
            title: '备注说明',
            width: '15%',
            dataIndex: 'remark',
        },

        {
            title: '操作',
            valueType: 'option',
            fixed: 'right',
        },
    ];
    //汇总不可编辑
    const columns2 = [
        {
            title: '部门代码',
            dataIndex: 'departmentId',
            width: '15%',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        whitespace: true,
                        message: '此项是必填项',
                    },
                ],
            },
            // editable:false,
        },
        {
            title: '区域',
            key: 'areaName',
            dataIndex: 'areaName',
            width: '15%',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                areaTypesList.forEach((item: any) => {
                    options[item.areaName] = item.areaName
                });
                return options;
            },
            // editable:false,
        },
        {
            title: '员工类型',
            dataIndex: 'employeeType',
            width: '15%',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                employeeTypeList.forEach((item: any) => {
                    options[item.value] = item.label
                });
                return options;
            },
            // editable:false,

        },
        {
            title: '績效調整掛帳部門',
            width: '15%',
            dataIndex: 'buyerDepartment',
            // editable:false,
        },
        {
            title: 'BU代碼(Profit center)',
            dataIndex: 'buId',
            width: '15%',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                buList.forEach((item: any) => {
                    options[item.value] = item.label
                });
                return options;
            }
        },
        {
            title: '金额',
            width: '15%',
            dataIndex: 'money',
            // editable:false,
        },
        {
            title: '备注说明',
            width: '15%',
            dataIndex: 'remark',
            // editable:false,
        },
    ];
    const columnsArea = [
        {
            title: '区域别',
            key: 'areaType',
            dataIndex: 'areaType',
            valueType: 'select',
            valueEnum: () => {
                const options = {};
                areaTypeList.forEach((item: any) => {
                    options[item.value] = item.label
                });
                return options;
            },
        },
        {
            title: '区域别金额',
            ellipsis: true,
            dataIndex: 'areaMoney',
            valueType: 'text',
            innerWidth: 50,
            fieldProps: {
                precision: 2,
            }
        },
        {
            title: '增值税税额（仅限增值税专用发票）',
            ellipsis: true,
            dataIndex: 'vatAmount',
            valueType: 'text',
            fieldProps: {
                precision: 2,
            },
        },
        {
            title: '分摊金额',
            dataIndex: 'contributions',
            valueType: 'text',
            ellipsis: true,
            editable: false,
            fieldProps: {
                precision: 2,
            },
            render: (text, record, index) => {
                let vatAmount = 0;
                if (record.areaType == areaTypeList[0].value) {
                    vatAmount = Number(record.vatAmount);
                }
                const value = Number(record.areaMoney) - vatAmount;
                return <span >{value}</span>
            }
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text: any, record: any, _: any, action: any) => [
                <a
                    key="editable"
                    onClick={() => {
                        console.log("startEditable");
                        console.log(record.guId, record, "startEditable");
                        action?.startEditable?.(record.guId);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setAreaSource(areaSource.filter((item: any) => item.guId !== record.guId));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];
    const columnsCash: ProColumns<EstimateApportionMainSource>[] = [
        {
            title: '预估单号',
            dataIndex: 'formId',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '申请部门',
            dataIndex: 'departmentId',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '申请人',
            dataIndex: 'cruser',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '费用类别',
            dataIndex: 'costAlias',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '费用项目',
            dataIndex: 'costProject',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '预估金额',
            dataIndex: 'totalMoney',
            width: 120,
            ellipsis: true,
            search: false,
        },
        {
            title: '使用金额',
            width: 120,
            search: false,
            render: (text, record, index) => {
                const value = Number(record.totalMoney) - Number(record.balance);
                return <a type="link" onClick={() => {
                    console.log(record.formId);
                    //根据预估单号到后台查询使用 此预估单的冲销单
                    // showModal();
                }}>{value}</a>
            }
        },
        {
            title: '剩余金额',
            dataIndex: 'balance',
            width: 120,
            ellipsis: true,
            search: false,
        },
    ];

    const [formId, setFormId] = useState("");//单号 
    //存储单据信息（验证/绑定数据/保存）
    const [formData, setFormData]: any = useState({
        formId: '',
        companyCode: '',
        billType: '',
        vendorCode: '',
        vendorName: '',
        vendorAlias: '',
        costAlias: '',
        costProject: '',
        costAffiliationDate: '',
        estimateFormId: '',
        prepayFormId: '',
        currency: '',
        totalMoney: 0,
        prepayMoney: 0,
        chargeDnNumber: '',
        chargeMoney: 0,
        paymentMoney: 0,
        cashContext: '',
        paymentTerm: '',
        paymentDate: new Date(),
        summary: '',
        state: '',
        crdate: '',
        cruser: '',
        updateTime: '',
        updateUser: '',
        departmentId: '',
        invoiceType: '',
    });//单据信息
    const intl = useIntl();
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
        defaultData.map((item) => item.id),
    );
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const [cashList, setCashList] = useState([]);

    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });

    const { initialState } = useModel("@@initialState");//登录人信息
    const [loginUserId, setLoginUserId] = useState(initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');//按钮开关
    const [btnFlag, setBtnFlag] = useState(false);//按钮开关
    const [detailFlag, setDetailFlag] = useState(true);//分摊 明细 开关

    const [areaSource, setAreaSource] = useState([]);//区域明细
    const [invoiceSource, setInvoiceSource] = useState([]);//增值税发票
    const [fiscalReceiptSource, setFiscalReceiptSource] = useState([]);//财政数据
    const [foreignInvoiceSource, setForeignInvoiceSource] = useState([]);//国外Invoice

    const [invoiceBar, setInvoiceBar] = useState({
        noTaxMoneyH: 0,
        taxLimitH: 0,
        amountH: 0,
        foreignCurrencyMoneyH: 0
    });//增值税发票表头
    const [fiscalReceiptBar, setFiscalReceiptBar] = useState({
        amountH: 0
    });//财政数据表头
    const [foreignInvoiceBar, setForeignInvoiceBar] = useState({
        foreignMoneyH: 0,
        convertRmbMoneyH: 0
    });//国外Invoice表头



    const [dataSource, setDataSource] = useState([]);//汇总
    const [shareSource, setShareSource] = useState([]);//分摊明细
    const [companList, setCompanyList] = useState<CompanyData[]>([]);//公司別
    const [sapCompanyCodeList, setSapCompanyCodeList] = useState<OptionsData[]>([]);//公司別-下拉框
    const [costAliasList, setCostAliasList] = useState<OptionsData[]>([]);//费用类别
    const [costProjectList, setCostProjectList] = useState<OptionsData[]>([]);//费用项目
    const [employeeTypeList, setEmployeeTypeList] = useState<OptionsData[]>([]);//员工类型
    const [currencyList, setCurrencyList] = useState<OptionsData[]>([]);//币别
    const [areaTypeList, setAreaTypeList] = useState<OptionsData[]>([
        { label: '厂区', value: '厂区' },
        { label: '宿舍', value: '宿舍' },
        { label: '餐厅', value: '餐厅' }]);//区域别
    const [areaTypesList, setAreaTypesList] = useState<AreaTypesData[]>([]);//区域别-区域名称
    const [costRulesList, setCostRulesList] = useState<CostRulesData[]>([]);//公司別-費用類型-必填欄位
    const [abstractRuleList, setAbstractRuleList] = useState<AbstractRuleData[]>([]);//摘要规则
    const [buList, setBuList] = useState<OptionsData[]>([]);//bu代码
    const [summary, setSummary] = useState("");//摘要

    const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
    const [areaFlag, setAreaFlag] = useState(true);//摘要
    const [invoiceFlag, setInvoiceFlag] = useState(true);//增值税发票
    const [fiscalReceiptFlag, setFiscalReceiptFlag] = useState(true);//财政收据
    const [foreignInvoiceFlag, setForeignInvoiceFlag] = useState(true);//国外Invoice

    const [paymentMoney, setPaymentMoney] = useState(0);//总金额是否可以输入
    const [totalMoney, setTotalMoney] = useState(0);//总金额
    const [referenceId, setReferenceId] = useState(loginUserId);//上传文件绑定的Id
    const [invoiceType, setInvoiceType] = useState<OptionsData[]>([]);//发票类型
    const [currate, setCurrate] = useState(1);//对RMB汇率

    const [modelMessage, setModelMessage] = useState('是否为最后一次请款？');//提示是否为最一次请款
    const [initialValues, setInitialValues] = useState({
        autoGenerateRefenceId: false,
        dictKey: '',
        referenceId: '',
        mode: "edit",
        callBackUrl: '',
        category: "",
        subCategory: "",
        item: "",
    });

    const formRef = useRef();

    const areasRef = useRef();

    const huiRef = useRef();
    const shareRef = useRef();

    const signRef = useRef();

    // 本部门 可用预估单 查询
    const showModal = async () => {
        setIsModalVisible(true);
        console.log(formData);
        console.log(loginUserId, "loginUserId");
        const reslult = await findAllByCrdateBy(formData.companyCode, formData.costAlias, formData.costProject, loginUserId);
        setCashList(reslult.data);
    };
    //控制浮层   确认k  
    const handleOk = () => {
        setIsModalVisible(false);
        initAreaType(formData.companyCode);
    };
    //控制浮层   取消
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const showModal2 = () => {
        setIsModalVisible2(true);
    };

    const handleOk2 = () => {
        //展示费用分摊明细，强制输入
        setDetailFlag(false);
        message.info("请上传费用分摊明细！！");
        setIsModalVisible2(false);
        initAreaType(formData.companyCode);
    };

    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };

    const handleOk3 = () => {
        //展示费用分摊明细，强制输入
        setDetailFlag(false);
        message.info("请上传费用分摊明细！！");
        setIsModalVisible2(false);
        initAreaType(formData.companyCode);
    };

    const handleCancel3= () => {
        setIsModalVisible3(false);
    };
    useEffect(() => {
        initCompany();
        initCurrency();
        // initAbstractRule();  //摘要规则
        // initCompanyAlias();   //初始公司别下拉框，以及公司別-費用類型-必填欄位
        initBuCode();     //初始化BU代码
        // initAreaType();    //初始区域别，以及公司別-費用類型-必填欄位
        initEmployeeType();     //初始化员工类型
        initForm();
    }, [])
    useEffect(() => {
        setSummaryValue();
    }, [formData])
    useEffect(() => {
        getDate();
    }, [formData.paymentTerm])

    //页面跳转初始化
    const initForm = async () => {
        const id = await getPageQuery().referenceId?.toString();
        if (id !== "" && id !== undefined) {
            await initForms(id).then(async res => {
                console.log(res.data, "---------aaaaaaaaaaaaaaaaaa--------------");
                // setFormId(id);

                // (formRef.current as any).setFieldsValue({ invoiceType: [ { label: '增值税发票', value: '增值税发票' }] });
                if (res.code == 200) {
                    (formRef.current as any).setFieldsValue(res.data.main);
                    (formRef.current as any).setFieldsValue({ areaSource: res.data.area });
                    (formRef.current as any).setFieldsValue({ invoiceSource: res.data.vatInvoice });
                    (formRef.current as any).setFieldsValue({ fiscalReceiptSource: res.data.fiscalReceipt });
                    (formRef.current as any).setFieldsValue({ foreignInvoiceSource: res.data.foreignInvoice });
                    console.log(res.data, "res.data");

                    setFormData(res.data.main);
                    setPaymentMoney(res.data.main.paymentMoney);
                    //费用类别

                    // const index4 = getArrayIndex(costAliasList, res.data.main.costAlias);
                    // setIndexCostAlias(index4);
                    // //费用项目
                    // const index5 = getArrayIndex(costProjectList, res.data.main.costProject);
                    // setIndexCostProject(index5);
                    //发票信息
                    const array = res.data.main.invoiceType.split(",");
                    if (array.length > 0) {
                        let invoiceTypeList: OptionsData[] = [];
                        array.forEach((element: string) => {
                            const invoiceTypeObj: OptionsData = { label: '', value: '', };
                            invoiceTypeObj.label = element;
                            invoiceTypeObj.value = element;
                            invoiceTypeList.push(invoiceTypeObj);
                        });
                        setInvoiceType(invoiceTypeList);
                        invoiceOff(invoiceTypeList);
                    }

                    if ((res.data.main.state == 'open' || res.data.main.state == 'reject') && res.data.main.cruser == initialState?.currentUser?.employeeInfoDTO?.emplid) {
                        //所有显示，按钮可用
                        setBtnFlag(false);

                        (signRef.current as any).hidden = true;
                    } else {
                        //只显示单据信息，明细隐藏，按钮不可用
                        setBtnFlag(true);
                    }

                    await waitTime(200);//页面加载完成以后再执行赋值操作
                    // setInitSelectValue(res.data.main);
                    res.data.area.forEach((item: any) => {
                        if (item.areaId !== undefined) {
                            delete item.areaId;
                            delete item.formId;
                        }
                    });
                    //对区域做处理
                    if (res.data.area == null || res.data.area.length == 0) {
                        setAreaFlag(true);
                    } else {
                        if (res.data.main.state == 'open' || res.data.main.state == 'reject') {
                            setAreaFlag(false);
                        }
                        // setAreaSource(res.data.area);
                    }
                    if (res.data.main.state !== 'open') {
                        (formRef.current as any).disabled = true;
                        // (signRef.current as any).hidden = false;
                    }
                    // //根據單據狀態判斷是否顯示
                    setInitialValues({
                        autoGenerateRefenceId: false,
                        dictKey: '',
                        referenceId: res.data.main.formId,
                        mode: "edit",
                        callBackUrl: '',
                        category: "",
                        subCategory: "",
                        item: "",
                    });
                    setSummary(res.data.main.summary);
                    setReferenceId(id);
                    // getCostAlias(res.data.main.companyAlias, res.data.main.billType);
                    // getCostProject(res.data.main.companyAlias, res.data.main.billType, res.data.main.costAlias);
                }
            });
        } else {
            (signRef.current as any).hidden = true;
        }
        setInvoiceBarValue();
        setFiscalReceiptBarValue();
        setForeignInvoiceBarValue();
    }
    //日期格式处理
    const dateFilter = (date: Date) => {
        let Y = date.getFullYear() + "-"
        let M =
            (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-"
        let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
        return Y + M + D
    }
    //获取最晚日期
    const getLastDate = () => {
        const formValue = (formRef.current as any).getFieldsValue();
        console.log(formValue, "formValue");
        let oneDate = '';
        let twoDate = '';
        let threeDate = '';
        if (formValue.invoiceSource !== undefined && formValue.invoiceSource !== null) {
            for (var i = 0; i < formValue.invoiceSource.length; i++) {
                if (i == 0) {
                    oneDate = dateFilter(new Date(formValue.invoiceSource[0].invoiceDate));
                } else {
                    if (dateFilter(new Date(formValue.invoiceSource[i].invoiceDate)) > oneDate) {
                        oneDate = dateFilter(new Date(formValue.invoiceSource[i].invoiceDate));
                    }
                }
            }
        }
        if (formValue.fiscalReceiptSource !== undefined && formValue.fiscalReceiptSource !== null) {
            for (var i = 0; i < formValue.fiscalReceiptSource.length; i++) {
                if (i == 0) {
                    twoDate = dateFilter(new Date(formValue.fiscalReceiptSource[0].invoiceDate));
                } else {
                    if (dateFilter(new Date(formValue.fiscalReceiptSource[i].invoiceDate)) > oneDate) {
                        twoDate = dateFilter(new Date(formValue.fiscalReceiptSource[i].invoiceDate));
                    }
                }
            }
        }
        if (formValue.foreignInvoiceSource !== undefined && formValue.foreignInvoiceSource !== null) {
            for (var i = 0; i < formValue.foreignInvoiceSource.length; i++) {
                if (i == 0) {
                    threeDate = dateFilter(new Date(formValue.foreignInvoiceSource[0].invoiceDate));
                } else {
                    if (dateFilter(new Date(formValue.foreignInvoiceSource[i].invoiceDate)) > oneDate) {
                        threeDate = dateFilter(new Date(formValue.foreignInvoiceSource[i].invoiceDate));
                    }
                }
            }
        }
        console.log(oneDate, twoDate, threeDate, "date");
        if (oneDate >= twoDate && oneDate >= threeDate) {
            return oneDate;
        } else if (twoDate >= oneDate && twoDate >= threeDate) {
            return twoDate;
        } else {
            return threeDate;
        }
    }
    //根据发票最晚日期和paymentTerm 获取付款日期
    const getDate = async () => {
        const date = getLastDate();//获取发票最晚日期
        console.log(date, "'date---------------------------");
        if (date !== undefined && date !== '' && date !== null) {
            const paymentTerm = formData.paymentTerm;
            const res = await getPaymentDate(date, paymentTerm);
            console.log(res, "'res");
            setFormData({ ...formData, paymentDate: res.data });
        }
    }
    //初始化公司别
    const initCompany = async () => {
        const result = await findAllCompany({} as CompanySource);
        setCompanyList(result);
        let companyCodeList: OptionsData[] = [];
        result.data.forEach((item: any) => {
            const tempDetail: OptionsData = { label: '', value: '', };
            tempDetail.label = item.sapCompanyCode;
            tempDetail.value = item.sapCompanyCode;
            companyCodeList.push(tempDetail);
        });
        let obj: OptionsData = {};
        companyCodeList = companyCodeList.reduce((cur, next) => {
            obj[next.label] ? "" : obj[next.label] = true && cur.push(next);
            return cur;
        }, []) //设置cur默认类型为数组，并且初始值为空的数组
        setSapCompanyCodeList(companyCodeList);
    }

    //根据公司别、单据类型  获取费用类别
    const getCostAlias = async (companyCode: string, billType: string) => {
        setCostAliasList([]);
        (formRef.current as any).setFieldsValue({ costAlias: '', costProject: '' });
        setFormData({ ...formData, costAlias: '', costProject: '' });
        if (companyCode == "" || companyCode == undefined) {
            message.error({
                content: "请先选择公司别",
                duration: 5,
                style: {
                    marginTop: '20vh',
                },
            });
        }
        const result: any = await findAllCostAccountantCourse("", { companyCode: companyCode, itemType: billType } as CostAccountantCourseSource);
        console.log(result, "拉去费用类别");
        if (result.code == 200) {
            let costAliasList: OptionsData[] = [];
            result.data.forEach((item: any) => {
                const tempDetail: OptionsData = { label: '', value: '', };
                tempDetail.label = item.costAlias;
                tempDetail.value = item.costAlias;
                costAliasList.push(tempDetail);
            });
            costAliasList = deWeight(costAliasList);
            setCostAliasList(costAliasList);
        }

    }
    //根据公司别和费用类别获取费用项目
    const getCostProject = async (companyCode: string, billType: string, costAlias: string) => {
        setCostProjectList([]);
        (formRef.current as any).setFieldsValue({ costProject: '' });
        setFormData({ ...formData, costProject: '' });
        const result: any = await findAllCostAccountantCourse("", { companyCode: companyCode, itemType: billType, costAlias: costAlias } as CostAccountantCourseSource);
        if (result.code == 200) {
            let costProjectList: OptionsData[] = [];
            result.data.forEach((item: any) => {
                const tempDetail: OptionsData = { label: '', value: '', };
                tempDetail.label = item.costProject;
                tempDetail.value = item.costProject;
                costProjectList.push(tempDetail);
            });
            costProjectList = deWeight(costProjectList);
            setCostProjectList(costProjectList);
        }
    }

    //初始化币别
    const initCurrency = async () => {
        const result: any = await findAllCurrency({} as CurrencySource);
        let currencylist: OptionsData[] = [];
        result.data.forEach((item: any) => {
            const tempDetail = { label: '', value: '', };
            tempDetail.label = item.currency;
            tempDetail.value = item.currency;
            currencylist.push(tempDetail);
        })
        setCurrencyList(currencylist)
    };

    //初始化员工类型
    const initEmployeeType = async () => {
        const result: any = await findAllEmployeeType({} as EmployeeTypeSource);
        let employeeTypelist: OptionsData[] = [];
        result.data.forEach((item: any) => {
            const tempDetail = { label: '', value: '', };
            tempDetail.label = item.employeeType;
            tempDetail.value = item.employeeType;
            employeeTypelist.push(tempDetail);
        })
        setEmployeeTypeList(employeeTypelist)
    };
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ['序号', '部门代码', '区域', '员工类型',
                '績效調整掛帳部門', 'BU代碼', '金额', '备注说明']
        ]
        shareSource.forEach((item: any, index: number) => {
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.departmentId ? item.departmentId : ''}`,
                `${item.areaName ? item.areaName : ''}`,
                `${item.employeeType ? item.employeeType : ''}`,
                `${item.buyerDepartment ? item.buyerDepartment : ''}`,
                `${item.buId ? item.buId : ''}`,
                `${item.money ? item.money : ''}`,
                `${item.remark ? item.remark : ''}`,
            ];
        })
        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            { wch: 10 },
            { wch: 15 },
            { wch: 10 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, '费用分摊明细.xlsx')
    }
    //下载表格数据
    const downloadData2 = () => {
        const aoa = [
            ['序号', '部门代码', '区域', '员工类型',
                '績效調整掛帳部門', 'BU代碼', '金额', '备注说明']
        ]
        dataSource.forEach((item: any, index: number) => {
            aoa[Number(index + 1)] = [
                `${index + 1}`,
                `${item.departmentId ? item.departmentId : ''}`,
                `${item.areaName ? item.areaName : ''}`,
                `${item.employeeType ? item.employeeType : ''}`,
                `${item.buyerDepartment ? item.buyerDepartment : ''}`,
                `${item.buId ? item.buId : ''}`,
                `${item.money ? item.money : ''}`,
                `${item.remark ? item.remark : ''}`,
            ];
        })
        const ws = xlsx.utils.aoa_to_sheet(aoa);
        ws['!cols'] = [
            { wch: 10 },
            { wch: 15 },
            { wch: 10 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
        ]
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "sheet");
        xlsx.writeFile(wb, '费用分摊--汇总明细.xlsx')
    }
    //初始摘要规则
    const initAbstractRule = async (companyCode: string) => {
        const result: any = await findSummaryRuleList(companyCode);
        // const result: any = await findAllSummaryRule({} as SummaryRuleSource);
        if (result.code == 200) {
            let abstractRulelist: AbstractRuleData[] = [];
            result.data.forEach((item: any) => {
                abstractRulelist.push(item);
            })
            setAbstractRuleList(abstractRulelist);
        }
    };

    //初始区域别，以及公司別-費用類型-必填欄位
    const initAreaType = async (companyCode: string) => {
        const result: any = await findAreaList(companyCode);
        // const result: any = await findAllArea({} as AreaSource);
        // let areaTypelist: OptionsData[] = [];
        let areaTypeslist: AreaTypesData[] = [];
        if (result.code == 200) {
            result.data.forEach((item: any) => {
                const tempDetail = { label: '', value: '' };
                tempDetail.label = item.areaType;
                tempDetail.value = item.areaType;
                // areaTypelist.push(tempDetail);
                areaTypeslist.push(item);
            })
            // areaTypelist = deWeight(areaTypelist);
            // setAreaTypeList(areaTypelist);
            setAreaTypesList(areaTypeslist);
        }
    };

    //初始公司别下拉框，以及公司別-費用類型-必填欄位
    const initCompanyAlias = async (companyCode: string) => {
        console.log(companyCode, "companyCode");
        // const result: any = await findCostRuleList("", companyCode);
        // const result: any = await findAllCostRules("", { companyCode: companyCode } as CostRulesSource);
        const result: any = await findAllCostRules("", { companyCode: companyCode } as CostRulesSource);
        let companyAliaslist: OptionsData[] = [];
        let costRuleslist: CostRulesData[] = [];
        if (result.code == 200) {
            result.data.forEach((item: any) => {
                //公司别
                const tempDetail = { label: '', value: '', };
                tempDetail.label = item.companyCode;
                tempDetail.value = item.companyCode;
                companyAliaslist.push(tempDetail);
                costRuleslist.push(item);
            })
            companyAliaslist = deWeight(companyAliaslist);
            setSapCompanyCodeList(companyAliaslist);
            setCostRulesList(costRuleslist);
        }

    };
    //初始化BU代码
    const initBuCode = async () => {
        const result: any = await findAllProfitCenter({} as ProfitCenterSource);
        let bulist: OptionsData[] = [];
        result.data.forEach((item: any) => {
            const tempDetail = { label: '', value: '', };
            tempDetail.label = item.customerGroup;
            tempDetail.value = item.customerGroup;
            bulist.push(tempDetail);
        })
        bulist = deWeight(bulist);
        setBuList(bulist)
    };
    //根據label去重
    const deWeight = (objs: OptionsData[]) => {
        let obj: OptionsData = {};
        objs = objs.reduce((cur, next) => {
            obj[next.label] ? "" : obj[next.label] = true && cur.push(next);
            return cur;
        }, [])
        return objs;
    }
    const downloadTemplateFt = () => {
        downloadTemplate("EG");
    }
    //点击汇总事件
    const collect = async () => {
        // if (formData.companyAlias == '' || formData.costAlias == '' || formData.costProject == '') {
        //     message.error({
        //         content: "请先选择公司别/费用类别/费用项目",
        //         duration: 5,
        //         style: {
        //             marginTop: '20vh',
        //         },
        //     });
        //     return;
        // }
        // var errorMessage1 = "";
        // var errorMessage2 = "";
        // var errorMessage3 = "";
        // var errorMessage4 = "";
        // let flag = true;
        // const formValue = (form.current as any).getFieldsValue();
        // const shareValue: [] = formValue.costDataSimple;
        // //校验部门是否存在
        // let company = formData.companyAlias;
        // let companyCode: string;
        // companList.forEach(item => {
        //     if (item.sapCompanyCode == company) {
        //         companyCode = item.psCompanyCode?.toString();
        //     }
        // })
        // let par1: string = undefined;
        // let par2: string = undefined;
        // if (companyCode != '' && companyCode != undefined) {
        //     let params: string[] = companyCode.split(',');
        //     if (params.length > 1) {
        //         par1 = params[0].replace(/\s+/g, "");
        //         par2 = params[1].replace(/\s+/g, "");
        //     }
        //     else if (params.length > 0) {
        //         par1 = params[0].replace(/\s+/g, "");
        //         par2 = "";
        //     }
        // }
        // let abstractRule: CostRulesData = {};
        // costRulesList.forEach(item => {
        //     if (item.costAlias == formData.costAlias && item.costProject == formData.costProject) {
        //         abstractRule = item;
        //         return;
        //     }
        // })
        // big: for (let i = 0; i < shareValue.length; i++) {
        //     let share: any = shareValue[i];
        //     if (share.money.indexOf(".") != -1) {
        //         if (share.money.toString().split(".")[1].length > 2) {
        //             errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的金额-" + share.money + "只能填写两位小数" + " \r\n";
        //             flag = false;
        //         }
        //     }

        //     //卡部门和挂账部门不为空
        //     if (share.departmentId == '' || share.departmentId == undefined || share.buyerDepartment == '' || share.buyerDepartment == undefined) {
        //         errorMessage4 = "部门和挂账部门为必填项，请补全！！！";
        //     }

        //     let data = await findDept(share.departmentId, par1, par2);
        //     if (data.code != 200) {
        //         errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的部门-" + share.departmentId + "不在此公司别下面或不存在" + " \r\n";
        //         flag = false;
        //     }
        //     if (share.buyerDepartment !== undefined && share.buyerDepartment !== "") {
        //         let data2 = await findDept(share.buyerDepartment, par1, par2);
        //         if (data2.code != 200) {
        //             errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的部门-" + share.departmentId + "不在此公司别下面或不存在" + " \r\n";
        //             flag = false;
        //         }
        //     }
        //     //如果区域不为必填项，则修改为空
        //     if (abstractRule.areaFlag == "Y") {
        //         if (share.areaName == '' || share.areaName == undefined) {
        //             errorMessage2 = "此单据区域为必填项，请全部补全" + " \r\n";
        //             flag = false;
        //         } else {
        //             //1,首先判断是否存在此区域
        //             var result_one = areaTypesList.some(function (item) {
        //                 if (item.areaName == share.areaName) { //item.name == "小百里守约"
        //                     shareValue[i].areaType = item.areaType;
        //                     return true;  //返回false
        //                 } else {
        //                     return false;  //返回false
        //                 }
        //             })
        //             if (result_one == false) {
        //                 errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的区域-" + share.areaName + "不存在" + " \r\n";
        //                 flag = false;
        //             }
        //         }
        //     }
        //     //员工类型处理
        //     if (abstractRule.employeeTypeFlag == "Y" || shareValue[i].areaType == '宿舍') {
        //         if (share.employeeType == '' || share.employeeType == undefined) {
        //             errorMessage2 = "此单据员工类型为必填项，请全部补全" + " \r\n";
        //             flag = false;
        //         }
        //     } else {
        //         share.employeeType = "";
        //     }
        // }
        // //根据部门排序
        // shareValue.sort(compare);
        // if (flag == true) {
        //     detailedSummary(shareValue).then(res => {
        //         if (res.code == 200) {
        //             // const datas={data:res.data,success: true,}
        //             setShareSource([]);
        //             setDataSource([]);
        //             setShareSource(shareValue);
        //             setDataSource(res.data);

        //             message.success({
        //                 content: res.message,
        //                 duration: 5,
        //                 style: {
        //                     marginTop: '20vh',
        //                 },
        //             });
        //         } else {
        //             message.error({
        //                 content: res.message,
        //                 duration: 5,
        //                 style: {
        //                     marginTop: '20vh',
        //                 },
        //             });
        //         }
        //     })
        // } else {
        //     setDataSource([]);
        //     notification.error({
        //         message: '校验错误提示',
        //         description: errorMessage4 + errorMessage2 + errorMessage3 + errorMessage1,
        //         duration: null,
        //         top: 30,
        //         className: 'notificationName',
        //     });
        // }

    }
    const uploadprops = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: (file: Blob, fileList: any) => {
            if (formData.companyAlias == '' || formData.costAlias == '' || formData.costProject == '') {
                message.error("请先选择公司别/费用类别/费用项目");
                return;
            }
            setShareSource([]);
            setDataSource([]);
            const fileReader = new FileReader();
            var data: any = [];
            var data2: any = [];
            var flag = true;
            var errorMessage1 = "";
            var errorMessage2 = "";
            var errorMessage3 = "";
            var errorMessage4 = "";
            fileReader.onload = async event => {
                const bstr = (event.target as any).result;
                const workbook = xlsx.read(bstr, { type: 'binary' });
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        data = data.concat(xlsx.utils.sheet_to_json(workbook.Sheets[sheet], { raw: false }));
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }
                for (let index = 1; index < data.length; index++) {
                    data2[index - 1] = data[index];
                }
                console.log(data2, "data2");
                //请求后台查看部门是否存在当前公司别下面
                const res: any = await getCostRule(formData.companyCode, formData.costAlias, formData.costProject);
                let abstractRule: CostRulesData = {};
                if (res.code == 200) {
                    abstractRule = res.data;
                } else {
                    message.info(res.message);
                }
                // let abstractRule: CostRulesData = {};
                // costRulesList.forEach(item => {
                //     if (item.costAlias == formData.costAlias && item.costProject == formData.costProject) {
                //         abstractRule = item;
                //         return;
                //     }
                // })
                big: for (let index = 0; index < data2.length; index++) {
                    const element = data2[index];
                    if (element.money.indexOf(".") != -1) {
                        //判断小数位数
                        if (element.money.toString().split(".")[1].length > 2) {
                            errorMessage1 = errorMessage1 + "第" + (index + 3) + "行中的金额-" + element.money + "只能填写两位小数" + " \r\n";
                        }
                    }
                    //卡部门和挂账部门不为空
                    if (element.departmentId == '' || element.departmentId == undefined) {
                        errorMessage4 = "部门为必填项，请补全！！！";
                        flag = false;
                    }
                    // if (element.departmentId == '' || element.departmentId == undefined || element.buyerDepartment == '' || element.buyerDepartment == undefined) {
                    //     errorMessage4 = "部门和挂账部门为必填项，请补全！！！";
                    //     flag = false;
                    // }
                    let data = await findDept2(element.departmentId, formData.companyCode);
                    if (data.code !== 200) {
                        errorMessage1 = errorMessage1 + "第" + (index + 3) + "行中的部门-" + element.departmentId + "不在此公司别下面或不存在" + " \r\n";
                        flag = false;
                    }
                    // if (element.buyerDepartment !== undefined && element.buyerDepartment !== "") {
                    //     let dataX = await findDept2(element.buyerDepartment, formData.companyAlias);
                    //     if (dataX.code !== 200) {
                    //         errorMessage1 = errorMessage1 + "第" + (index + 3) + "行中的挂账部门" + element.buyerDepartment + "不在此公司别下面或不存在" + " \r\n";
                    //         flag = false;
                    //     }
                    // }
                    //对区域的处理
                    //如果区域不为必填项，则修改为空
                    if (abstractRule.areaFlag == "Y") {
                        if (element.areaName == '' || element.areaName == undefined) {
                            errorMessage2 = "此单据区域为必填项，请全部补全" + " \r\n";
                            flag = false;
                        } else {
                            //1,首先判断是否存在此区域
                            var result_one = areaTypesList.some(function (item) {
                                if (item.areaName == element.areaName) { //item.name == "小百里守约"
                                    element.areaType = item.areaType;
                                    return true;  //返回false
                                } else {
                                    return false;  //返回false
                                }
                            })
                            if (result_one == false) {
                                errorMessage1 = errorMessage1 + "第" + (index + 3) + "行中的区域不可为空" + " \r\n";
                                flag = false;
                            }
                        }
                    }
                    //员工类型处理
                    if (abstractRule.employeeTypeFlag == "Y" || element.areaType == areaTypeList[1].value) {
                        if (element.employeeType == '' || element.employeeType == undefined) {
                            errorMessage3 = "此单据员工类型不可为空,请全部补全" + " \r\n";
                            flag = false;
                        }
                    } else {
                        element.employeeType = "";
                    }
                }
                //根据部门排序
                data2.sort(compare);
                if (flag) {
                    getDifferenceDetail(data2).then(res => {
                        console.log(res, "res汇总数据");
                        if (res.code == 200) {
                            setShareSource([]);
                            setShareSource(data2);
                            setDataSource(res.data);
                            message.success(res.message);
                        } else {
                            message.error(res.message);
                        }
                    })
                } else {
                    setDataSource([]);
                    notification.error({
                        message: '校验错误提示',
                        description: errorMessage4 + errorMessage2 + errorMessage3 + errorMessage1,
                        duration: null,
                        top: 30,
                        className: 'notificationName',
                    });
                }
            }
            fileReader.readAsBinaryString(file);
        },
    };
    //数组对象排序(根据部门排序)
    const compare = (obj1: any, obj2: any,) => {
        var val1 = obj1.departmentId;
        var val2 = obj2.departmentId;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }
    //摘要赋值
    const setSummaryValue = async () => {
        let value = '';
        if (formData.companyCode !== '' && formData.costAlias !== '' && formData.costProject !== '') {
            const res: any = await getSummaryRule(formData.companyCode, formData.costAlias, formData.costProject);
            let abstractRule: AbstractRuleData = {};
            if (res.code == 200) {
                abstractRule = res.data;
            } else {
                message.info(res.message);
            }
            console.log(abstractRule, "abstractRule");
            console.log(areaSource, "areaSource");
            if (abstractRule != null) {
                if (abstractRule.costAffiliationDateFlag == 'Y') {
                    if (formData.costAffiliationDate != undefined) {
                        value = value + formData.costAffiliationDate;
                    }
                }
                //区域
                if (abstractRule.areaTypeFlag == 'Y') {
                    const formValue = (formRef.current as any).getFieldsValue();
                    console.log(formValue, "formValue");
                    console.log(formValue.areaSource, "formValue.areaData");
                    if (formValue.areaSource != undefined) {
                        formValue.areaSource.forEach((item2: { areaType: string; }) => {
                            value = value + item2.areaType;
                        })
                    }
                }
                if (abstractRule.costProjectFlag == 'Y') {
                    value = value + formData.costProject;
                }
                console.log(formData.vendorAlias, "formData.vendorAlias");
                console.log(abstractRule.manuFacturerShortName, "abstractRule.manufacturerShortName");
                if (abstractRule.manuFacturerShortName == 'Y') {
                    console.log(formData.vendorAlias, "formData.vendorAlias");
                    value = value + formData.vendorAlias;
                }
            }
            const summaryValue = value.replace("undefined", "");
            const summaryX = summaryValue.replace("null", "");
            console.log(summaryX, "summaryX");
            setSummary(summaryX);
        }
        // setFormData({...formData,summary:summaryX});
    }

    //校验金额
    const verifyMoney = () => {
        console.log(formData, "formData");
    }
    const getPaymentMoney = (totalmoney: number, money1: number, money2: number) => {
        setPaymentMoney(totalmoney - money1 - money2);
        // setFormData({...formData,paymentMoney:totalmoney - money1 - money2});
    }
    //增值税发票表头input赋值
    const setInvoiceBarValue = () => {
        const formData = (formRef.current as any).getFieldsValue();
        let money1 = 0;
        let money2 = 0;
        let money3 = 0;
        let money4 = 0;
        if (formData.invoiceSource != null) {
            formData.invoiceSource.forEach((item: any) => {
                money1 = money1 * 1 + item.noTaxMoney * 1;
                money2 = money2 * 1 + item.taxLimit * 1;
                money3 = money3 * 1 + item.amount * 1;
                money4 = money4 * 1 + item.foreignCurrencyMoney * 1;
            })
            console.log(money1, money2, money3, money4, "AAAAAAAAAAAAAAAAA");
            setInvoiceBar({ noTaxMoneyH: money1, taxLimitH: money2, amountH: money3, foreignCurrencyMoneyH: money4 });

        }
    }
    //国内收据表头input赋值
    const setFiscalReceiptBarValue = () => {
        const formData = (formRef.current as any).getFieldsValue();
        let money1 = 0;
        if (formData.fiscalReceiptSource != null) {
            formData.fiscalReceiptSource.forEach((item: any) => {
                money1 = money1 * 1 + item.amount * 1;
            })
            setFiscalReceiptBar({ amountH: money1 });
        }
    }
    //国外Invoice表头赋值
    const setForeignInvoiceBarValue = () => {
        const formData = (formRef.current as any).getFieldsValue();
        let money1 = 0;
        let money2 = 0;
        if (formData.foreignInvoiceSource != null) {
            formData.foreignInvoiceSource.forEach((item: any) => {
                money1 = money1 * 1 + item.convertRmbMoney * 1;
                money2 = money2 * 1 + item.foreignMoney * 1;
            })
            setForeignInvoiceBar({ convertRmbMoneyH: money1, foreignMoneyH: money2 });
        }
    }

    //发票金额与总金额核对(不一致返回true)
    const moneyVerify = (value: any) => {
        let money = 0;
        if (formData.currency == 'RMB') {
            money = invoiceBar.noTaxMoneyH + fiscalReceiptBar.amountH;
        } else {
            money = invoiceBar.foreignCurrencyMoneyH + foreignInvoiceBar.foreignMoneyH;
        }

        if (formData.totalMoney == money) {
            return false;
        } else {
            return true;
        }
    }
    //冲销金额
    const writeOffsMoney = async () => {
        let moeny: number = 0;
        const res = await findAllCompany({ sapCompanyCode: formData.companyCode } as CompanySource);
        //是否为一般纳税人
        console.log(res.data, "res.data");
        console.log(res.data[0], "res.data");
        if (res.data[0].taxpayerFlag == 'Y') {
            console.log(areaSource, "areaSource");
            if (areaSource !== null) {
          
                areaSource.forEach((item: any) => {
                    let vatAmount = 0;
                    console.log(areaTypeList[0].value, "areaTypeList[0].value");
                    if (item.areaType == areaTypeList[0].value) {
                        vatAmount = Number(item.vatAmount);
                    }
                    const value = Number(item.areaMoney) - vatAmount;
                    moeny = moeny * 1 + value * 1;
                    console.log(item, "item");
                    console.log(value, "moeny1111");
                    console.log(moeny, "moeny1111");
                })
            } else {
                const result: any = await findAllCostAccountantCourse("", { companyCode: formData.companyCode, itemType: formData.billType, costAlias: formData.costAlias, costProject: formData.costProject } as CostAccountantCourseSource);
                //是否为福利金
                if (result.data.get(0).cctbFlag == 'Y') {
                    moeny = formData.totalMoey * 1;
                } else {
                    invoiceSource.forEach((item: any) => {
                        if (item.invoiceType == invoiceTypes[0].value) {//判断是否为增值税专用发票，是，加入不含税金额（&&国内收据总金额）
                            moeny = moeny + item.noTaxMoney * 1 + fiscalReceiptBar.amountH;
                        } else {//不是，加入含税金额（&&国内收据总金额）
                            moeny = moeny + item.amount * 1 + fiscalReceiptBar.amountH;
                        }
                    })
                }
            }
        } else {//公司不是一般纳税人用冲销金额=总金额
            moeny = formData.totalMoey * 1;
        }
        console.log(moeny, "moeny");
        return moeny;
    }
    //发票显示方法
    const invoiceOff = (e: any) => {
        if (getArrayIndex(e, invoiceTypeList[0].value) !== -1) {
            setInvoiceFlag(false);
        } else {
            setInvoiceFlag(true);
            (formRef.current as any).setFieldsValue({ invoiceSource: [] });
            setInvoiceBar({
                noTaxMoneyH: 0,
                taxLimitH: 0,
                amountH: 0,
                foreignCurrencyMoneyH: 0
            });
        }
        if (getArrayIndex(e, invoiceTypeList[1].value) !== -1) {
            setFiscalReceiptFlag(false);
        } else {
            setFiscalReceiptFlag(true);
            (formRef.current as any).setFieldsValue({ fiscalReceiptSource: [] });
            setFiscalReceiptBar({
                amountH: 0
            });
        }
        if (getArrayIndex(e, invoiceTypeList[2].value) !== -1) {
            setForeignInvoiceFlag(false);
        } else {
            setForeignInvoiceFlag(true);
            (formRef.current as any).setFieldsValue({ foreignInvoiceSource: [] });
            setForeignInvoiceBar({
                foreignMoneyH: 0,
                convertRmbMoneyH: 0
            });
        }
    }
    let title: string | null = null;
    return (
        <div>
            <PageContainer>
                <ProForm layout="horizontal" formRef={formRef}
                    onFinish={async (value) => {
                        // await waitTime(2000);
                        //1,核对发票金额与总金额
                        if (moneyVerify(value)) {
                            message.error("发票金额与总金额不一致，请核对！！！");
                            return;
                        }
                        const result: any = await getBalance(formData.estimateFormId);

                        //2，核对，冲销金额与预估金额  （>0     ==0       <0）

                        //剩余金额
                        let balance: number = 0;
                        if (formData.currency == 'RMB') {
                            const cashMoney: number = await writeOffsMoney();
                            balance = result.data - cashMoney;
                        } else {
                            balance = result.data - formData.totalMoney;
                        }
                        console.log(balance,"--------------------");
                        //冲销金额大于预估金额，
                        if (balance < 0) {
                            setModelMessage('冲销金额大于了预估金额,请确认是否为最后一次请款');
                            setIsModalVisible3(true);
                            // message.error({
                            //     content: '冲销金额大于了预估金额，请核对！！！',
                            //     duration: 5,
                            //     style: {
                            //         marginTop: '20vh',
                            //     },
                            // });
                            // return;
                        }
                        formData.summary = summary;
                        formData.paymentMoney = paymentMoney;
                        console.log(formData, "formData-------------");
                        console.log(value, "value-------------");
                        //区域做处理
                        let areaData: any;
                        if (value.areaSource == undefined) {
                            areaData = areaSource;
                        } else {
                            areaData = value.areaSource;
                        }
                        areaData.forEach((item: any) => {
                            if (item.id !== undefined) {
                                delete item.id;
                            }
                            if (item.areaId !== undefined) {
                                delete item.areaId;
                            }
                        });
                        //增值税发票
                        let invoiceData: any;
                        if (value.invoiceSource == undefined) {
                            invoiceData = invoiceSource;
                        } else {
                            invoiceData = value.invoiceSource;
                        }
                        invoiceData.forEach((item: any) => {
                            if (item.id !== undefined) {
                                delete item.id;
                            }
                        });
                        //财政数据
                        let fiscalReceiptData: any;
                        if (value.fiscalReceiptSource == undefined) {
                            fiscalReceiptData = fiscalReceiptSource;
                        } else {
                            fiscalReceiptData = value.fiscalReceiptSource;
                        }
                        fiscalReceiptData.forEach((item: any) => {
                            if (item.id !== undefined) {
                                delete item.id;
                            }
                        });
                        //国外Invoice
                        let foreignInvoiceData: any;
                        if (value.foreignInvoiceSource == undefined) {
                            foreignInvoiceData = foreignInvoiceSource;
                        } else {
                            foreignInvoiceData = value.foreignInvoiceSource;
                        }
                        foreignInvoiceData.forEach((item: any) => {
                            if (item.id !== undefined) {
                                delete item.id;
                            }
                        });
                        let list: any = {
                            cashRequirement: {},
                            area: {},
                            invoice: {},
                            fiscalReceipt: {},
                            foreignInvoice: {},
                        };
                        if (formData.formId === '' || formData.formId === undefined) {
                            formData.cruser = initialState?.currentUser?.employeeInfoDTO?.emplid;
                            formData.departmentId = initialState?.currentUser?.employeeInfoDTO?.deptid;
                            formData.updateUser = initialState?.currentUser?.employeeInfoDTO?.emplid;
                        } else {
                            formData.updateUser = initialState?.currentUser?.employeeInfoDTO?.emplid;
                        }
                        if (formData.state == "" || formData.state == undefined) {
                            formData.state = "init";
                        }
                        list.cashRequirement = formData;
                        list.area = areaData;
                        list.invoice = invoiceData;
                        list.fiscalReceipt = fiscalReceiptData;
                        list.foreignInvoice = foreignInvoiceData;
                        console.log(list, "list");
                        // console.log(title);
                        // message.success('提交成功');
                        const res = await saveCashRequirement(list);
                        if (res.code == 200) {
                            setFormId(res.data);
                            setFormData({ ...formData, formId: res.data });
                            message.success({
                                content: '保存成功',
                                duration: 5,
                                style: {
                                    marginTop: '20vh',
                                },
                            });
                            if (balance > 0) {
                                setIsModalVisible2(true);
                                const result: any = await getTotalMoney(formData.estimateFormId);
                                const balanceBFB = balance / result.data;
                                if (balanceBFB <= 0.15) {
                                    setModelMessage('剩余金额小于等于15%，,请确认是否为最后一次请款');
                                    setIsModalVisible2(true);
                                }
                            }
                            if (title == 'sendOut' && res.data != "" && res.data != undefined) {
                                setInitialValues({
                                    autoGenerateRefenceId: false,
                                    dictKey: 'finance.epa.signSupervisor',
                                    referenceId: res.data,
                                    mode: "edit",
                                    // callBackUrl: getUrl(8000),
                                    callBackUrl: getUrl('com'),
                                    category: "财务",
                                    subCategory: "epa",
                                    item: formData.billType,
                                });
                            }
                        }
                    }}
                    submitter={{
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },
                        submitButtonProps: {},
                        // 完全自定义整个区域
                        render: (props, doms) => {
                            return [
                                <Button type="primary" key="rest" onClick={() => {
                                    props.form?.resetFields();
                                    setFormData({
                                        formId: '',
                                        companyCode: '',
                                        billType: '',
                                        vendorCode: '',
                                        vendorName: '',
                                        vendorAlias: '',
                                        costAlias: '',
                                        costProject: '',
                                        costAffiliationDate: '',
                                        estimateFormId: '',
                                        prepayFormId: '',
                                        currency: '',
                                        totalMoney: 0,
                                        prepayMoney: 0,
                                        chargeDnNumber: '',
                                        chargeMoney: 0,
                                        paymentMoney: 0,
                                        cashContext: '',
                                        paymentTerm: '',
                                        paymentDate: new Date(),
                                        summary: '',
                                        state: '',
                                        crdate: '',
                                        cruser: '',
                                        updateTime: '',
                                        updateUser: '',
                                        departmentId: '',
                                        invoiceType: '',
                                    });
                                    setPaymentMoney(0);
                                    setInvoiceType([]);
                                    invoiceOff([]);
                                }} >
                                    新增
                                </Button>,
                                <Button type="primary" key="submit" disabled={btnFlag} onClick={() => { title = "提交", props.form?.submit?.() }}>
                                    暂存
                                </Button>,
                                <Button type="primary" key="submit" disabled={btnFlag} onClick={async () => {

                                    title = "sendOut", props.form?.submit?.()
                                }}>
                                    送出
                                </Button>,
                                <Button type="primary" key="submit" disabled={btnFlag} onClick={() => {
                                    console.log('=========', props.form?.getFieldsValue())
                                }}>
                                    取消
                                </Button>,
                            ];
                        },
                    }}
                >
                    <ProForm.Group>
                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                value: formData.companyCode,
                                // labelInValue: true,
                                onChange: (e) => {
                                    console.log(e, "companyCode");
                                    initAreaType(e as string);
                                    initAbstractRule(e as string);
                                    initCompanyAlias(e as string);
                                    setFormData({ ...formData, companyCode: e });
                                }
                            }}
                            valueEnum={() => {
                                const options = {};
                                sapCompanyCodeList.forEach((item: any) => {
                                    options[item.value] = item.label
                                });
                                return options;
                            }}
                            name="companyCode"
                            label="公司别"
                            rules={[{ required: true, message: '请选择公司别!' }]}
                            placeholder='请选择公司别'
                        />
                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                // value: formData.billType,
                                // labelInValue: true,
                                onChange: (e) => {
                                    console.log(e);
                                    getCostAlias(formData.companyCode, e);
                                    setFormData({ ...formData, billType: e });
                                }
                            }}
                            request={async () =>
                                billtype
                            }
                            name="billType"
                            label="单据类型"
                            rules={[{ required: true, message: '请选择单据类型!' }]}
                            placeholder='请选择单据类型'
                        />
                        <ProFormText
                            width="sm"
                            name="formId"
                            label="单号"
                            placeholder='表单保存后自动生成'
                            disabled
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="sm"
                            name="vendorCode"
                            label="厂商代码"
                            rules={[{ required: true, message: '请选择厂商代码!' }]}
                            placeholder='请填写厂商代码'
                            fieldProps={{
                                onMouseOut: async (e) => {
                                    console.log((e.target as any).value);
                                    if ((e.target as any).value !== undefined && (e.target as any).value !== '') {
                                        setFormData({ ...formData, vendorCode: (e.target as any).value });
                                        //根据公司别，厂商代码给厂商名称,厂商简称，PaymentTerm赋值
                                        const result = await findAllVendor("", { companyCode: formData.companyCode, vendorGeneral: e.target.value } as VendorSourceType);
                                        if (result.code == 200) {
                                            console.log(result.data);
                                            setFormData({ ...formData, vendorName: result.data[0].name, vendorAlias: result.data[0].searchTerm1, paymentTerm: result.data[0].paymentTermCompany });
                                        } else {
                                            message.error("没有此厂商代码,请重新填写!!");
                                        }
                                    }
                                },
                                onChange: async (e) => {
                                    setFormData({ ...formData, vendorCode: (e.currentTarget as any).value });
                                }
                            }}
                        />
                        <ProFormText
                            width="sm"
                            name="vendorName"
                            label="厂商名称"
                            disabled
                            fieldProps={{
                                value: formData.vendorName,
                            }}
                            placeholder="厂商代码自动带出"
                        />
                        <ProFormText
                            width="sm"
                            name="vendorForShort"
                            label="厂商简称"
                            placeholder="厂商代码自动带出"
                            disabled
                            fieldProps={{
                                value: formData.vendorAlias,
                            }}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                // value: formData.costAlias,
                                // labelInValue: true,
                                onChange: (e) => {
                                    console.log(e);
                                    getCostProject(formData.companyCode, formData.billType, e as string);
                                    setFormData({ ...formData, costAlias: e });

                                    // const index = getArrayIndex(costAliasList, e);
                                    // setIndexCostAlias(index);
                                }
                            }}
                            valueEnum={() => {
                                const options = {};
                                costAliasList.forEach((item: any) => {
                                    options[item.value] = item.label
                                });
                                return options;
                            }}
                            name="costAlias"
                            label="费用类别"
                            rules={[{ required: true, message: '请选择费用类别!' }]}
                            placeholder='请选择费用类别'
                        />
                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                // value: formData.costProject,
                                // labelInValue: true,
                                onChange: (e) => {
                                    console.log(e, "item");
                                    console.log(costRulesList, "costRulesList");
                                    costRulesList.forEach(item => {
                                        console.log(item, "item");
                                        if (item.costProject == e) {
                                            //区域是否显示
                                            if (item.areaFlag == 'Y') {
                                                setAreaFlag(false);
                                                return;
                                            } else {
                                                setAreaFlag(true);
                                                setAreaSource([]);
                                                return;
                                            }
                                        }
                                    })
                                    setFormData({ ...formData, costProject: e });
                                    // const index = getArrayIndex(costProjectList, e);
                                    // setIndexCostProject(index);
                                }
                            }}
                            valueEnum={() => {
                                const options = {};
                                costProjectList.forEach((item: any) => {
                                    options[item.value] = item.label
                                });
                                return options;
                            }}
                            name="costProject"
                            label="费用项目"
                            rules={[{ required: true, message: '请选择费用项目!' }]}
                            placeholder='请选择费用项目'
                        />
                        <ProFormDatePicker.Month width="sm" name="costAffiliationDate" label="费用归属年月"
                            fieldProps={{
                                format: 'YYYYMM',
                                onChange: (e) => {
                                    setFormData({ ...formData, costAffiliationDate: e?.format("YYYYMM") ? e?.format("YYYYMM") : '' });
                                }
                            }}
                            rules={[{
                                required: true, message: '请选择费用归属年月!'
                            }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="sm"
                            name="estimateFormId"
                            label="原预估单号"
                            placeholder="请输入名称"
                            hidden={false} //控制组件显示隐藏
                            fieldProps={{
                                value: formData.estimateFormId,
                                onClick: () => {
                                    showModal();
                                }
                            }}
                        />
                        <ProFormText
                            width="sm"
                            name="prepayFormId"
                            label="原预付款单号"
                            placeholder="请输入名称"
                            disabled
                            fieldProps={{
                                value: formData.prepayFormId,
                                onClick: () => {
                                    showModal2();
                                }
                            }}
                        />
                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                value: formData.currency,
                                // labelInValue: true,
                                onChange: async (e) => {
                                    setFormData({ ...formData, currency: e });
                                    verifyMoney();
                                    const res = await findCcurrateByCcurfrom(e);
                                    console.log(res, "currate");
                                    if (res.code == 200) {
                                        setCurrate(res.data);
                                    }
                                }
                            }}
                            valueEnum={() => {
                                const options = {};
                                currencyList.forEach((item: any) => {
                                    options[item.value] = item.label
                                });
                                return options;
                            }}
                            name="currency"
                            label="请款币别"
                            rules={[{ required: true, message: '请选择币别!' }]}
                            placeholder='请选择币别'
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormDigit
                            width="sm"
                            name="totalMoney"
                            label="总金额"
                            placeholder="请输入总金额（只保留两位小数）"
                            fieldProps={{
                                precision: 2,
                                value: formData.totalMoney,
                                onChange: async (e) => {
                                    const param: number = Number(Number(e).toFixed(2));
                                    setFormData({ ...formData, totalMoney: param });
                                    getPaymentMoney(param, formData.prepayMoney, formData.chargeMoney);
                                }
                            }}
                        // rules={[{ required: true, message: '请输入总金额!' }]}
                        />
                        <ProFormDigit
                            width="sm"
                            name="prepayMoney"
                            label="预付款冲销金额"
                            placeholder="请输入预付款冲销金额（只保留两位小数）"
                            fieldProps={{
                                precision: 2,
                                value: formData.prepayMoney,
                                onChange: async (e) => {
                                    const param: number = Number(Number(e).toFixed(2));
                                    setFormData({ ...formData, prepayMoney: param });
                                    getPaymentMoney(formData.totalMoney, param, formData.chargeMoney);
                                }
                            }}
                        />
                        <ProFormText
                            width="sm"
                            name="chargeDnNumber"
                            label="扣款DN号码"
                            placeholder="请输入名称"
                            fieldProps={{
                                value: formData.chargeDnNumber,
                                onChange: (e) => {
                                    setFormData({ ...formData, chargeDnNumber: (e.currentTarget as any).value });
                                }
                            }}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormDigit
                            width="sm"
                            name="chargeMoney"
                            label="扣款金额"
                            placeholder="请输入扣款金额（只保留两位小数）"
                            fieldProps={{
                                precision: 2,
                                value: formData.chargeMoney,
                                onChange: async (e) => {
                                    const param: number = Number(Number(e).toFixed(2));
                                    setFormData({ ...formData, chargeMoney: param });
                                    getPaymentMoney(formData.totalMoney, formData.prepayMoney, param);
                                }
                            }}
                        />
                        <ProFormDigit
                            width="sm"
                            name="paymentMoney"
                            label="本次付款金额"
                            disabled
                            placeholder="系统自动计算"
                            fieldProps={{
                                precision: 2,
                                value: paymentMoney,
                                onChange: (e) => {
                                    const param: number = Number(Number(e).toFixed(2));
                                    setFormData({ ...formData, paymentMoney: param });
                                }
                            }}
                        />
                        <ProFormText
                            width="md"
                            name="cashContext"
                            label="请款内容"
                            fieldProps={{
                                value: formData.cashContext,
                                onChange: (e) => {
                                    setFormData({ ...formData, cashContext: (e.currentTarget as any).value });
                                }
                            }}
                            placeholder="请输入请款内容"
                            rules={[{ required: true, message: '请输入请款内容!' }]}
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="sm"
                            disabled
                            fieldProps={{
                                value: formData.paymentTerm,
                                onChange: () => {
                                    getDate();
                                }
                            }}
                            name="costProject"
                            label="Payment Term"
                            rules={[{ required: true }]}
                            placeholder="厂商代码自动带出"
                        />

                        <ProFormDatePicker width="sm" name="paymentDate" label="付款日期"
                            tooltip='发票最晚日期和paymentTerm计算'
                            disabled
                            fieldProps={{
                                value: formData.paymentDate,
                            }}
                        />
                        <ProFormText
                            width="md"
                            name="summary"
                            label="摘要显示"
                            fieldProps={{
                                value: summary,
                            }}
                            readonly
                            placeholder="自动带出"
                        />
                    </ProForm.Group>
                    <ProForm.Group >
                        <ProForm.Item
                            name="areaSource"
                            // trigger="onValuesChange"
                            hidden={areaFlag}
                        >
                            <EditableProTable
                                rowKey="guId"
                                headerTitle="区域明细"
                                name="areaData"
                                actionRef={areasRef}
                                onChange={setAreaSource}
                                value={areaSource}
                                maxLength={3}
                                toolBarRender={() => [
                                    <div style={{ width: 100 + '%', marginRight: 0 }}>
                                        <Button type="primary" disabled={btnFlag} onClick={() => {
                                            console.log("--------------");
                                            setAreaSource([]);
                                            (formRef.current as any).setFieldsValue({ areaSource: [] });
                                        }}>
                                            清空
                                        </Button>
                                    </div>
                                ]}
                                // request={(params, sorter, filter) => {
                                //     return Promise.resolve({
                                //         data: areaSource,
                                //         success: true,
                                //     });
                                // }}
                                columns={columnsArea}
                                recordCreatorProps={{
                                    newRecordType: 'dataSource',
                                    position: 'bottom',  //top
                                    record: () => ({
                                        guId: Date.now(),
                                    }),
                                }}
                                editable={{
                                    type: 'multiple',
                                    editableKeys,
                                    onChange: setEditableRowKeys,
                                    onSave: async (row, _, dom) => {
                                        // await waitTime(2000);
                                        // setNewRecord({
                                        //     id: (Math.random() * 1000000).toFixed(0),
                                        // });
                                        setSummaryValue();
                                        // setToTalMoneyValue();
                                    },
                                }}
                            />
                        </ProForm.Item>
                    </ProForm.Group>

                    <ProForm.Group >
                        {/* <Upload {...props}   >
                            上传附件(签呈/合同等)
                        //     {/* <Button icon={<UploadOutlined />}>上传附件(签呈/合同等)</Button> 
                        // </Upload> */}

                        <ProFormSelect
                            width="md"
                            mode="multiple"
                            fieldProps={{
                                value: invoiceType,
                                labelInValue: true,
                                onChange: (e) => {
                                    console.log(e, "e");
                                    let param = '';
                                    if (e.length > 0) {
                                        for (var i = 0; i < e.length; i++) {
                                            if (i == 0) {
                                                param = e[i].value;
                                            } else {
                                                param = param + ',' + e[i].value;
                                            }
                                        }
                                    }
                                    setFormData({ ...formData, invoiceType: param });
                                    setInvoiceType(e);
                                    if (getArrayIndex(e, invoiceTypeList[0].value) !== -1) {
                                        setInvoiceFlag(false);
                                    } else {
                                        setInvoiceFlag(true);
                                        (formRef.current as any).setFieldsValue({ invoiceSource: [] });
                                        setInvoiceBar({
                                            noTaxMoneyH: 0,
                                            taxLimitH: 0,
                                            amountH: 0,
                                            foreignCurrencyMoneyH: 0
                                        });
                                    }
                                    if (getArrayIndex(e, invoiceTypeList[1].value) !== -1) {
                                        setFiscalReceiptFlag(false);
                                    } else {
                                        setFiscalReceiptFlag(true);
                                        (formRef.current as any).setFieldsValue({ fiscalReceiptSource: [] });
                                        setFiscalReceiptBar({
                                            amountH: 0
                                        });
                                    }
                                    if (getArrayIndex(e, invoiceTypeList[2].value) !== -1) {
                                        setForeignInvoiceFlag(false);
                                    } else {
                                        setForeignInvoiceFlag(true);
                                        (formRef.current as any).setFieldsValue({ foreignInvoiceSource: [] });
                                        setForeignInvoiceBar({
                                            foreignMoneyH: 0,
                                            convertRmbMoneyH: 0
                                        });
                                    }
                                    getArrayIndex(e, "增值税发票");
                                    console.log(getArrayIndex(e, "增值税发票"), "getArrayIndex");
                                }
                            }}
                            request={async () =>
                                invoiceTypeList
                            }
                            rules={[{ required: true }]}
                            name="invoiceType"
                            label="发票类型"
                        />
                        <div style={{ marginBottom: 25 }}>
                            <OAFileUpload
                                // uploadColumns={uploadColumns}
                                uploadColumns={[]}
                                showTabs={["normal"]}
                                referenceId={referenceId}
                                title="上传附件(签呈/合同等)"
                                mode="button"  //tab  button
                                onExcelFinish={{
                                    success: async data => {

                                        // const result = data as TruckPlanInfo[];

                                        // for (let i = 0; i < result.length; i++) {
                                        //const truckPlanInfo = result[i];
                                        //console.log(truckPlanInfo.driverId, truckPlanInfo);
                                        // }             
                                        console.log("received result from upload component", data)
                                    }
                                }} />
                        </div>
                    </ProForm.Group>
                    <ProForm.Group  >
                        <ProForm.Item
                            name="invoiceSource"
                            trigger="onValuesChange"
                            hidden={invoiceFlag}
                        >
                            <EditableProTable
                                rowKey="guId"
                                headerTitle="增值税发票"
                                onChange={setInvoiceSource}
                                value={invoiceSource}
                                name="invoiceData"
                                scroll={{ x: 1500 }}
                                toolBarRender={() => [
                                    <ProForm.Group>
                                        <ProForm.Group style={{ marginTop: 18, marginRight: 1, padding: 0, gap: 3 }}>
                                            <ProFormText
                                                width="xs"
                                                name="noTaxMoneyH"
                                                label="不含税金额合计"
                                                placeholder="自动合计"
                                                className="toolBar"
                                                disabled
                                                initialValue={0}
                                                fieldProps={{
                                                    value: invoiceBar.noTaxMoneyH,
                                                }}
                                            />
                                            <ProFormText
                                                width="xs"
                                                name="taxLimitH"
                                                className="toolBar"
                                                label="税额合计"
                                                placeholder="自动合计"
                                                disabled
                                                initialValue={0}
                                                fieldProps={{
                                                    value: invoiceBar.taxLimitH,
                                                }}
                                            />
                                            <ProFormText
                                                width="xs"
                                                name="amountH"
                                                label="发票金额合计"
                                                placeholder="自动合计"
                                                disabled
                                                initialValue={0}
                                                fieldProps={{
                                                    value: invoiceBar.amountH,
                                                }}
                                            />
                                            <ProFormText
                                                width="xs"
                                                name="foreignCurrencyMoneyH"
                                                label="外币金额合计"
                                                placeholder="自动合计"
                                                disabled
                                                initialValue={0}
                                                fieldProps={{
                                                    value: invoiceBar.foreignCurrencyMoneyH,
                                                }}
                                            />
                           
                                        <ModalForm
                                            title="可选发票"
                                            width={85 + '%'}
                                            trigger={<Button type="primary" style={{ marginBottom: 23, marginLeft: -24, marginRight: -24 }} 
                                                onClick={async () => {
                                                // console.log(row.formId, "---------------------------------------------");
                                                // //接收两个参数，1，签核流程key，（truck.uploadTruckInfoSignFlow）2，单号(WKS202105080000142465)
                                                // const result: any = await getSignRecordListByReferenceId(row.formId);
                                                // // const result = await generateSignRecordListByDictKey("truck.uploadTruckInfoSignFlow", "WKS202105080000142465");
                                                // console.log(result);
                                                // if (result.errorCode == 0) {
                                                //     if (result.data && result.data.list.length > 0) {
                                                //         setSignRecordDTOList(result.data.list as SignRecordDTO[]);
                                                //     }
                                                // } else {
                                                //     message.error(result.errorMessage);
                                                // }
                                            }}>可选发票</Button>}
                                            submitter={{
                                                submitButtonProps: {
                                                    style: {
                                                        display: 'none',
                                                    },
                                                },
                                            }}
                                            onFinish={async (values) => {
                                                console.log(values);
                                                message.success('提交成功');
                                                return true;
                                            }}

                                        >
                                            <ProTable
                                                headerTitle="可选发票"
                                                pagination={{ pageSize: 6 }}
                                                search={{
                                                    layout: 'vertical',
                                                }}
                                                rowKey="id"
                                                scroll={{ x: 1500 }}
                                                toolbar={{
                                                    actions: [
                                                        <Button
                                                            key="add"
                                                            type="primary"
                                                            onClick={() => {
                                                                // handleModalVisible(true);
                                                            }}
                                                        >
                                                            信息登记
                                                        </Button>,
                                                        <Button key="add"
                                                            type="primary"
                                                            onClick={() => {
                                                                // handleExportExcel(formRef.current?.getFieldsValue());
                                                            }}>导出</Button>,
                                                    ],
                                                }}
                                                request={async (params) => {
                                                    console.log(params, "params------------------");
                                                    // const res = await queryTruckPlanInfo(params);
                                                    const list: any = {
                                                        pageIndex: params.current,
                                                        pageSize: params.pageSize,
                                                        data: {
                                                            companyCode: formData.companyCode?formData.companyCode:'L130',
                                                            // vendorCode: "",
                                                            // invoiceCode:params.invcode?params.invcode:'',
                                                            // invoiceNo: params.invno?params.invno:'',
                                                        }
                                                    }
                                                    const res: any =await getInvoiceList(list);
                                                    console.log("res", res);
                                                    console.log(res.status == 200);
                                                    console.log(res.status == "200");
                                                    return {
                                                        data: res.data.invoices,
                                                        total: res.total,
                                                        success: res.status == 200,
                                                    };
                                                }}
                                                columns={columnsInvoicePool}
                                                rowSelection={{
                                                    onChange: (_: any, selectedRows) => {
                                                        // setSelectedRows(selectedRows);
                                                    },
                                                }}
                                                editable={{
                                                    onSave: async (key, row, originRow) => {
                                                        console.log("saved row", row);
                                                        // await handleUpdateTruckInfo({ ...originRow, ...row });
                                                    },
                                                    onDelete: async (key, row) => {
                                                        console.log("delete row", row);
                                                        // await handleDeleteTruckInfo(row);
                                                    }
                                                }

                                                }
                                            />
                                        </ModalForm>
                                        <Button type="primary" disabled={btnFlag} style={{ marginBottom: 23}} onClick={() => {
                                            (formRef.current as any).setFieldsValue({ invoiceSource: [] });
                                            setInvoiceSource([]);
                                            setInvoiceBar({
                                                noTaxMoneyH: 0,
                                                taxLimitH: 0,
                                                amountH: 0,
                                                foreignCurrencyMoneyH: 0
                                            });
                                        }}>
                                            清空
                                        </Button>
                                        </ProForm.Group>
                                    </ProForm.Group>
                                ]}
                                columns={invoiceColumns}
                                recordCreatorProps={false}
                                // recordCreatorProps={{
                                //     newRecordType: 'dataSource',
                                //     position: 'bottom',
                                //     record: () => ({
                                //         guId: Date.now(),
                                //     }),
                                // }}
                                // request={(params, sorter, filter) => {
                                //     // 表单搜索项会从 params 传入，传递给后端接口。
                                //     return Promise.resolve({
                                //         data: invoiceSource,
                                //         success: true,
                                //     });
                                // }}
                                editable={{
                                    type: 'multiple',
                                    editableKeys,
                                    onChange: setEditableRowKeys,
                                    onSave: async (row, _, dom) => {
                                        console.log(dom, "dom");
                                        setInvoiceBarValue();
                                        getDate();
                                    },
                                    // actionRender: (row, _, dom) => {
                                    //     return [dom.delete];
                                    // },
                                }}
                            />
                        </ProForm.Item>
                    </ProForm.Group>
                    <ProForm.Group >
                        <ProForm.Item
                            name="fiscalReceiptSource"
                            trigger="onValuesChange"
                            hidden={fiscalReceiptFlag}
                        >
                            <EditableProTable
                                rowKey="guId"
                                headerTitle="财政收据"
                                onChange={setFiscalReceiptSource}
                                value={fiscalReceiptSource}
                                name="fiscalReceiptData"
                                toolBarRender={() => [
                                    <Button type="primary" disabled={btnFlag} style={{ marginBottom: 23 }} onClick={() => {
                                        (formRef.current as any).setFieldsValue({ fiscalReceiptSource: [] });
                                        setFiscalReceiptSource([]);
                                        setFiscalReceiptBar({ amountH: 0 });
                                    }}>
                                        清空
                                    </Button>,
                                    <ProFormText
                                        width="xs"
                                        name="amountH"
                                        label="收据金额合计"
                                        placeholder="自动合计"
                                        disabled
                                        initialValue={0}
                                        fieldProps={{
                                            value: fiscalReceiptBar.amountH,
                                        }}
                                    />
                                ]}
                                columns={fiscalReceiptColumns}
                                recordCreatorProps={{
                                    newRecordType: 'dataSource',
                                    position: 'bottom',
                                    record: () => ({
                                        guId: Date.now(),
                                    }),
                                }}
                                // request={(params, sorter, filter) => {
                                //     // 表单搜索项会从 params 传入，传递给后端接口。
                                //     return Promise.resolve({
                                //         data: fiscalReceiptSource,
                                //         success: true,
                                //     });
                                // }}
                                editable={{
                                    type: 'multiple',
                                    editableKeys,
                                    onChange: setEditableRowKeys,
                                    onSave: async (row, _, dom) => {
                                        console.log(row, "row");
                                        setFiscalReceiptBarValue();
                                        getDate();
                                    },
                                    // actionRender: (row, _, dom) => {
                                    //     return [dom.delete];
                                    // },
                                }}
                            />
                        </ProForm.Item>
                    </ProForm.Group>
                    <ProForm.Group  >
                        <ProForm.Item
                            name="foreignInvoiceSource"
                            trigger="onValuesChange"
                            hidden={foreignInvoiceFlag}
                        >
                            <EditableProTable
                                rowKey="guId"
                                headerTitle="国外Invoice"
                                onChange={setForeignInvoiceSource}
                                value={foreignInvoiceSource}
                                name="foreignInvoiceData"
                                toolBarRender={() => [
                                    <ProForm.Group>
                                        <Button type="primary" disabled={btnFlag} style={{ marginBottom: 27 }} onClick={() => {
                                            (formRef.current as any).setFieldsValue({ foreignInvoiceSource: [] });
                                            setForeignInvoiceSource([]);
                                            setForeignInvoiceBar({
                                                foreignMoneyH: 0,
                                                convertRmbMoneyH: 0
                                            });
                                        }}>
                                            清空
                                        </Button>
                                        <ProFormText
                                            width="xs"
                                            name="convertRmbMoneyH"
                                            label="折算人民币合计"
                                            placeholder="自动合计"
                                            disabled
                                            initialValue={0}
                                            fieldProps={{
                                                value: foreignInvoiceBar.convertRmbMoneyH,
                                            }}
                                        />
                                        <ProFormText
                                            width="xs"
                                            name="foreignMoneyH"
                                            label="外币金额合计"
                                            placeholder="自动合计"
                                            disabled
                                            initialValue={0}
                                            fieldProps={{
                                                value: foreignInvoiceBar.foreignMoneyH,
                                            }}
                                        />
                                    </ProForm.Group>
                                ]}
                                columns={foreignInvoiceColumns}
                                recordCreatorProps={{
                                    newRecordType: 'dataSource',
                                    position: 'bottom',
                                    record: () => ({
                                        guId: Date.now(),
                                    }),
                                }}
                                request={(params, sorter, filter) => {
                                    // 表单搜索项会从 params 传入，传递给后端接口。
                                    return Promise.resolve({
                                        data: foreignInvoiceSource,
                                        success: true,
                                    });
                                }}
                                editable={{
                                    type: 'multiple',
                                    editableKeys,
                                    onChange: setEditableRowKeys,
                                    onSave: async (row, _, dom) => {
                                        console.log(row, "row");
                                        setForeignInvoiceBarValue();
                                        getDate();
                                    },
                                    // actionRender: (row, _, dom) => {
                                    //     return [dom.delete];
                                    // },
                                }}
                            />

                        </ProForm.Item>
                    </ProForm.Group>
                </ProForm>

                <ProCard bordered hidden={detailFlag} style={{ marginTop: 8 }}>
                    <EditableProTable
                        rowKey="id"
                        actionRef={shareRef}
                        headerTitle="费用分摊明细"
                        value={shareSource}
                        onChange={setShareSource}
                        toolBarRender={() => [
                            <div style={{ width: 100 + '%' }}>
                                <Button type="primary" style={{ marginRight: 5 }} disabled={btnFlag} onClick={collect}>
                                    点击汇总
                                </Button>
                                <Upload {...uploadprops} disabled={btnFlag} >
                                    <Button type="ghost" disabled={btnFlag}>
                                        <Icon type="upload" /> 点击上传
                                    </Button>
                                </Upload>
                            </div>,
                            <Button type="primary" disabled={btnFlag} onClick={downloadTemplateFt}>
                                上传模板
                            </Button>,
                            <Button type="primary" disabled={btnFlag} style={{ marginLeft: 0 }} onClick={() => {
                                setShareSource([]);
                            }}>
                                清空
                            </Button>,
                            <Button type="primary" onClick={downloadData} >
                                下载
                            </Button>
                        ]}
                        request={(params, sorter, filter) => {
                            // 表单搜索项会从 params 传入，传递给后端接口。
                            return Promise.resolve({
                                data: shareSource,
                                success: true,
                            });
                        }}
                        pagination={{ defaultPageSize: 3 }}
                        columns={columns}
                        recordCreatorProps={{
                            newRecordType: 'dataSource',
                            position: 'top',
                            record: () => ({
                                id: Date.now(),
                            }),
                        }}
                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onChange: setEditableRowKeys,
                            actionRender: (row, _, dom) => {
                                return [dom.delete];
                            },
                        }}
                    />
                    <EditableProTable
                        style={{ marginTop: 12 }}
                        actionRef={huiRef}
                        headerTitle="最终汇总明細"
                        rowKey="id"
                        value={dataSource}
                        onChange={setDataSource}
                        toolBarRender={() => [
                            <div style={{ width: 100 + '%', marginRight: 0 }}>
                                <Button type="primary" disabled={btnFlag} onClick={() => {
                                    setDataSource([]);
                                }}>
                                    清空
                                </Button>
                                <Button type="primary" style={{ marginLeft: 5 }} onClick={downloadData2}>
                                    下载
                                </Button>
                            </div>
                        ]}
                        request={(params, sorter, filter) => {
                            // 表单搜索项会从 params 传入，传递给后端接口。
                            return Promise.resolve({
                                data: dataSource,
                                success: true,
                            });
                        }}
                        recordCreatorProps={false}
                        pagination={{ defaultPageSize: 3 }}
                        columns={columns2}
                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onChange: setEditableRowKeys,
                            actionRender: (row, _, dom) => {
                                return [dom.delete];
                            },
                        }}
                    />
                </ProCard>
                <ProCard hidden={false} style={{ marginTop: 15 }} ref={signRef}>
                    <OASignComponent
                        initialValues={initialValues}
                        onCreate={
                            {
                                success: async (data) => {
                                    // message.success({
                                    //     content: "送出成功",
                                    //     duration: 5,
                                    //     style: {
                                    //         marginTop: '20vh',
                                    //     },
                                    // });
                                    const res = await createSignFlow(formId);
                                    console.log(res, "res签核流程");
                                    window.location.reload();
                                    //改变单据状态
                                    (signRef.current as any).hidden = false;
                                    changeCashState(formId, "signing", initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
                                },
                                fail: async (referenceId, message) => {
                                }
                            }
                        }
                        onApprove={{
                            success: async (data) => {
                                if (data[data.length - 1].actualSignStatus !== 'P') {
                                    changeCashState(formId, "signed", initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
                                }
                            },
                        }}
                        onReject={{
                            success: async (data) => {
                                changeState(formId, "reject", initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
                            },
                        }}
                    >
                    </OASignComponent>
                </ProCard>
                {/* </QueryFilter> */}
                <Modal title="本部门可使用预估单号" width={1200} visible={isModalVisible}
                    onOk={handleOk} onCancel={handleCancel} footer={null} >
                    <ProTable<TableListItem>
                        rowKey="formId"
                        rowSelection={{
                            onChange: (_, selectedRows) => {
                                console.log(selectedRows, "selectedRows");
                                setSelectedRows(selectedRows);
                            },
                        }}
                        toolBarRender={() => [
                            <Button type="primary" key="primary" onClick={() => {
                                let value: string = "";
                                selectedRowsState.forEach((item: any) => {
                                    if (value == "") {
                                        value = item.formId;
                                    } else {
                                        value = value + ',' + item.formId;
                                    }
                                })
                                setFormData({ ...formData, estimateFormId: value });
                                handleOk();
                            }}>
                                確定
                            </Button>,
                        ]}
                        search={false}
                        columns={columnsCash}
                        dataSource={cashList}
                        pagination={{ defaultPageSize: 3 }}
                    />
                </Modal>
                <Modal title="" visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel2}>
                    <span >{modelMessage}</span>
                </Modal>

                <Modal title="" visible={isModalVisible3} onOk={handleOk3} onCancel={handleCancel3}>
                    <span style={{ color: 'red' }}>{modelMessage}</span>
                </Modal>
            </PageContainer>
        </div >
    )
}

export default CashRequirement;


