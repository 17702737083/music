import React, { useEffect, useRef, useState } from 'react'
import ProForm, {
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormDigit,
    ModalForm,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, message, notification, Spin, Table, Upload } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import Icon from '@ant-design/icons';
import { cancellation, changeFinanceSign, changeState, detailedSummary, downloadTemplate, findAreaList, findCostRuleList, findDept2, findSummaryRuleList, initForms, saveCostEstimateApportionForm } from './service';
import * as xlsx from 'xlsx'
import { getPageQuery, getUrl } from '../../util';
import OASignComponent from '@/components/OA/OASign';
import ProCard from '@ant-design/pro-card';
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';
import { AbstractRuleData, AreaSource, AreaTypesData, CompanyData, CompanySource, CostAccountantCourseSource, CostRulesData, CostRulesSource, CurrencySource, DepartmentData, EmployeeTypeSource, OptionsData, ProfitCenterSource, SummaryRuleSource, TaxRateSource } from '../../data';
import { useModel } from 'umi';
import { useIntl } from '@/.umi/plugin-locale/localeExports';
import './index.less';
import { findAllCompany } from '../../epaBaseData/Company/service';
import { findAllCostRules } from '../../ruleBaseData/CostRules/service';
import { findAllCurrency } from '../../epaBaseData/Currency/service';
import { findAllTaxRate } from '../../epaBaseData/TaxRate/service';
import { findAllArea } from '../../epaBaseData/Area/service';
import { findAllEmployeeType } from '../../epaBaseData/EmployeeType/service';
import { findAllSummaryRule } from '../../ruleBaseData/SummaryRule/service';
import { findAllProfitCenter } from '../../epaBaseData/ProfitCenter/service';
import { findAllCostAccountantCourse } from '../../epaBaseData/CostAccountantCourse/service';
//費用預估分摊页面

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const defaultData = [
    {
        id: 624748504,
    },
];

const billtype = [
    { label: '費用預估', value: '費用預估' },
    { label: 'PA分攤', value: 'PA分攤' },
    { label: '其他分攤', value: '其他分攤' },
];

notification.config({
    top: 100,
    duration: 5,
});

//費用預估分摊页面
const CostEstimateApportion: React.FC = () => {
    const intl = useIntl();
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
                let abstractRule: CostRulesData = {};
                costRulesList.forEach(item => {
                    if (item.costAlias == formData.costAlias && item.costProject == formData.costProject) {
                        abstractRule = item;
                        return;
                    }
                })
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
                    let data = await findDept2(element.departmentId, formData.companyAlias);
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
                    if (abstractRule.employeeTypeFlag == "Y" || element.areaType == '宿舍') {
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
                    detailedSummary(data2).then(res => {
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
            // formItemProps: {
            //     rules: [
            //         {
            //             required: true,
            //             whitespace: true,
            //             message: '此项是必填项',
            //         },
            //     ],
            // },
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
            fieldProps: {
                precision: 2,
            }
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text: any, record: { id: any; }, _: any, action: { startEditable: (arg0: any) => void; }) => [
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
                        setAreaSource(areaSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];


    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
        defaultData.map((item) => item.id),
    );
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const [btnHiddenFlag, setBtnHiddenFlag] = useState(false);
    const [costModelFlag, setCostModelFlag] = useState(true);
    const [areaModelFlag, setAreaModelFlag] = useState(true);
    const form = useRef();
    const hiddenRef = useRef();
    const hidden2Ref = useRef();
    //PA分攤控制四个输入框是否显示
    const paRef = useRef();
    //PA分攤控制四个输入框是否必填
    const paXRef = useRef();
    const areaRef = useRef();
    const costProjectRef = useRef();
    const huiRef = useRef();
    const shareRef = useRef();
    const areasRef = useRef();
    const signRef = useRef();
    const signsRef = useRef();

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
    //存储单据信息（验证/绑定数据/保存）
    const [formData, setFormData]: any = useState({
        formId: '',
        companyAlias: '',
        billType: '',
        costAlias: '',
        costProject: '',
        paNumber: '',
        invoiceNumber: '',
        invoiceDate: '',
        taxRate: '',
        costAffiliationDate: '',
        currency: '',
        totalMoney: 0,
        remark: '',
        summary: '',
        state: 'init',
        crdate: '',
        cruser: '',
        updateTime: '',
        updateUser: '',
        departmentId: '',
        balance: '',
    });//单据信息

    const [companyAliasList, setCompanyAlias] = useState<OptionsData[]>([]);//公司別-下拉框
    const [costAliasList, setCostAliasList] = useState<OptionsData[]>([]);//费用类别下拉框
    const [companList, setCompanyList] = useState<CompanyData[]>([]);//公司別全表

    //初始化數據用
    const [costRulesList, setCostRulesList] = useState<CostRulesData[]>([]);//公司別-費用類型-必填欄位
    const [currencyList, setCurrencyList] = useState<OptionsData[]>([]);//币别下拉框
    const [taxRateList, setTaxRateList] = useState<OptionsData[]>([]);//税率下拉框
    const [costProjectList, setCostProjectList] = useState<OptionsData[]>([]);//费用项目下拉框
    const [areaTypeList, setAreaTypeList] = useState<OptionsData[]>([]);//区域别下拉框
    const [areaTypesList, setAreaTypesList] = useState<AreaTypesData[]>([]);//区域别-区域名称
    const [employeeTypeList, setEmployeeTypeList] = useState<OptionsData[]>([]);//员工类型下拉框
    const [buList, setBuList] = useState<OptionsData[]>([]);//bu代码
    const [abstractRuleList, setAbstractRuleList] = useState<AbstractRuleData[]>([]);//摘要规则

    const [summary, setSummary] = useState("");//摘要
    const [totalMoney, setTotalMoney] = useState(0);//总金额
    const [areaSource, setAreaSource] = useState([]);//区域明细
    const [dataSource, setDataSource] = useState([]);//汇总
    const [shareSource, setShareSource] = useState([]);//分摊明细
    const [totalMoneyFlag, setTotalMoneyFlag] = useState(false);//汇总
    const [formId, setFormId] = useState("");//单号 
    const [initSelectValue, setInitSelectValue] = useState({
        companyAlias: '',
        billType: '',
        currency: '',
        costAlias: '',
        costProject: '',
        taxRate: '',
        totalMoney: 0,
        summary: '',
    });
    const [indexCompany, setIndexCompany] = useState(-1);//初始化下拉框 
    const [indexBilltype, setIndexBilltype] = useState(-1);//初始化下拉框 
    const [indexCurrency, setIndexCurrency] = useState(-1);//初始化下拉框 
    const [indexCostAlias, setIndexCostAlias] = useState(-1);//初始化下拉框 
    const [indexCostProject, setIndexCostProject] = useState(-1);//初始化下拉框 
    const [indexTaxRate, setIndexTaxRate] = useState(-1);//初始化下拉框 

    const [loadingFlag, setLoadingFlag] = useState(false);//加载标识 

    const [btnFlag, setBtnFlag] = useState(false);//
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

    const { initialState } = useModel("@@initialState");
    const [userId, setUserId] = useState(initialState?.currentUser?.employeeInfoDTO?.emplid);//登录人工号

    useEffect(async () => {
        setEditableRowKeys(() =>
            defaultData.map((item) => item.id),
        )
        initCompany();       // 初始化公司别（下拉框、全表）
        // initCompanyAlias();  // 初始公司别，以及公司別-費用類型-必填欄位
        initCurrency();      // 初始化币别
        initTaxRate();       // 初始化税率

        // initAreaType();      //初始化区域别
        initEmployeeType();  //初始化员工类型
        initBuCode();        //初始化BU代码
        // initAbstractRule();  //初始摘要规则

        initForm();
        //获取url参数。更新referenceId的值。
        //   const await getPageQuery().formId?.toString();
        //   setFormId(getPageQuery().formId?.toString());
    }, []);
    useEffect(() => {
        (huiRef.current as any).reload();
    }, [dataSource]);
    useEffect(() => {
        (shareRef.current as any).reload();
    }, [shareSource]);
    useEffect(() => {
        setSummaryValue();
        (areasRef.current as any).reload();
    }, [areaSource]);
    //监听页面数据改变（下拉框，日期，input）
    useEffect(() => {
        setSummaryValue();
    }, [formData]);
    useEffect(() => {
        //公司别
        const index = getArrayIndex(companyAliasList, initSelectValue.companyAlias);
        setIndexCompany(index);
        // 单据类型
        const index2 = getArrayIndex(billtype, initSelectValue.billType);
        setIndexBilltype(index2);
        //币别
        const index3 = getArrayIndex(currencyList, initSelectValue.currency);
        setIndexCurrency(index3);
        //费用类别

        const index4 = getArrayIndex(costAliasList, initSelectValue.costAlias);
        setIndexCostAlias(index4);
        //费用项目
        const index5 = getArrayIndex(costProjectList, initSelectValue.costProject);
        setIndexCostProject(index5);

        //总金额
        setTotalMoney(initSelectValue.totalMoney);
        //摘要
        setSummary(initSelectValue.summary);
        //对PA分攤做处理
        if (initSelectValue.billType == "PA分攤") {
            //四个输入框不隐藏，初始化值
            (paRef.current as any).hidden = false;
            //税率做初始化值
            const index6 = getArrayIndex(taxRateList, initSelectValue.taxRate);
            setIndexTaxRate(index6);
        } else {
            //隐藏四个输入框
            (paRef.current as any).hidden = true;
        }
    }, [initSelectValue]);

    const downloadTemplateFt = () => {
        downloadTemplate("EG");
    }
    const getArrayIndex = (arr: string | any[], obj: any) => {
        var i = 0;
        var flag = false;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].value == obj) {
                flag = true;
                break;
            }
        }
        if (flag == true) {
            return i;
        } else {
            return -1;
        }
    }
    //页面跳转初始化
    const initForm = async () => {
        const id = await getPageQuery().referenceId?.toString();
        if (id !== "" && id !== undefined) {
            await initForms(id).then(async res => {
                setFormId(id);
                if (res.code == 200) {
                    (form.current as any).setFieldsValue(res.data.main);
                    setFormData(res.data.main);

                    if ((res.data.main.state == 'open' || res.data.main.state == 'reject') && res.data.main.cruser == initialState?.currentUser?.employeeInfoDTO?.emplid) {
                        //所有显示，按钮可用
                        setBtnFlag(false);
                        setCostModelFlag(true);
                        (hiddenRef.current as any).hidden = false;
                        (hidden2Ref.current as any).hidden = false;
                        (areaRef.current as any).hidden = false;
                        (shareRef.current as any).hidden = false;
                    } else {
                        //只显示单据信息，明细隐藏，按钮不可用
                        setBtnFlag(true);
                        setBtnHiddenFlag(true);
                        (hiddenRef.current as any).hidden = true;
                        (hidden2Ref.current as any).hidden = true;
                        (areaRef.current as any).hidden = true;
                        setCostModelFlag(false);
                        if (res.data.area == null || res.data.area.length == 0) {
                            setAreaModelFlag(true);
                        } else {
                            setAreaModelFlag(false);
                        }
                    }
                    getCostAlias(res.data.main.companyAlias, res.data.main.billType);
                    getCostProject(res.data.main.companyAlias, res.data.main.billType, res.data.main.costAlias);
                    await waitTime(200);//页面加载完成以后再执行赋值操作
                    setInitSelectValue(res.data.main);
                    res.data.area.forEach((item: { id: any; attachId: undefined; formId: any; }) => {
                        if (item.attachId !== undefined) {
                            delete item.attachId;
                            delete item.formId;
                        }
                    });
                    //对区域做处理
                    if (res.data.area == null || res.data.area.length == 0) {
                        (areaRef.current as any).hidden = true;
                    } else {
                        if (res.data.main.state == 'open' || res.data.main.state == 'reject') {
                            (areaRef.current as any).hidden = false;
                        }
                        setTotalMoneyFlag(false);
                        setAreaSource(res.data.area);
                    }
                    setAreaSource(res.data.area);
                    //分摊明细及汇总的数据赋初始化值
                    setShareSource(res.data.detailList1);
                    setDataSource(res.data.detailList2);
                    if (res.data.main.state !== 'open') {
                        (form.current as any).disabled = true;
                        (signRef.current as any).hidden = false;
                    }
                    //根據單據狀態判斷是否顯示
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
                }
            });
        } else {
            (signRef.current as any).hidden = true;
        }
    }
    //根據label去重
    const deWeight = (objs: OptionsData[]) => {
        let obj: OptionsData = {};
        objs = objs.reduce((cur, next) => {
            obj[next.label] ? "" : obj[next.label] = true && cur.push(next);
            return cur;
        }, [])
        return objs;
    }

    //初始公司别(下拉框以及全表)
    const initCompany = async () => {
        const result: any = await findAllCompany({} as CompanySource);
        let companylists: CompanyData[] = [];
        let companyAliaslist: OptionsData[] = [];
        result.data.forEach((item: any) => {
            const tempDetail: OptionsData = { label: '', value: '', };
            tempDetail.label = item.sapCompanyCode;
            tempDetail.value = item.sapCompanyCode;
            companylists.push(item);
            companyAliaslist.push(tempDetail);
        })
        setCompanyAlias(companyAliaslist);
        setCompanyList(companylists);
    };
    //根据公司别、单据类型  获取费用类别
    const getCostAlias = async (companyCode: string, billType: string) => {
        setCostAliasList([]);
        setIndexCostAlias(-1);
        setIndexCostProject(-1);
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
        setIndexCostProject(-1);
        const result: any = await findAllCostAccountantCourse("", { companyCode: companyCode, itemType: billType, costAlias: costAlias } as CostAccountantCourseSource);
        console.log(result, "拉去费用项目");
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

    //初始公司别下拉框，以及公司別-費用類型-必填欄位
    const initCompanyAlias = async (companyCode: string) => {
        const result: any = await findCostRuleList("", companyCode);
        // const result: any = await findAllCostRules(formData.companyAlias,{} as CostRulesSource);
        console.log(result, "必填规则");
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
            setCompanyAlias(companyAliaslist);
            setCostRulesList(costRuleslist);
        }

    };
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
    //初始化稅率
    const initTaxRate = async () => {
        const result: any = await findAllTaxRate({} as TaxRateSource);
        let taxRatelist: OptionsData[] = [];
        result.data.forEach((item: any) => {
            const tempDetail = { label: '', value: '', };
            tempDetail.label = item.taxRate;
            tempDetail.value = item.taxRate;
            taxRatelist.push(tempDetail);
        })
        taxRatelist = deWeight(taxRatelist);
        setTaxRateList(taxRatelist)
    };

    //初始区域别，以及公司別-費用類型-必填欄位
    const initAreaType = async (companyCode: string) => {
        const result: any = await findAreaList(companyCode);
        // const result: any = await findAllArea({} as AreaSource);
        console.log(result, "区域");
        let areaTypelist: OptionsData[] = [];
        let areaTypeslist: AreaTypesData[] = [];
        if (result.code == 200) {
            result.data.forEach((item: any) => {
                const tempDetail = { label: '', value: '' };
                tempDetail.label = item.areaType;
                tempDetail.value = item.areaType;
                areaTypelist.push(tempDetail);
                areaTypeslist.push(item);
            })
            areaTypelist = deWeight(areaTypelist);
            setAreaTypeList(areaTypelist);
            setAreaTypesList(areaTypeslist);
        }

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
    //初始摘要规则
    const initAbstractRule = async (companyCode: string) => {
        const result: any = await findSummaryRuleList(companyCode);
        // const result: any = await findAllSummaryRule({} as SummaryRuleSource);
        console.log(result, "初始摘要规则");
        let abstractRulelist: AbstractRuleData[] = [];
        if (result.code == 200) {
            result.data.forEach((item: any) => {
                abstractRulelist.push(item);
            })
            setAbstractRuleList(abstractRulelist);
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

    //调用初始化查询
    const fetchRemoteData = async (params: string) => {
        return await queryDictDetail(params);
    };

    //摘要赋值
    const setSummaryValue = () => {
        let value = '';
        let abstractRule: AbstractRuleData = {};
        console.log(abstractRuleList, "abstractRuleList摘要规则");
        abstractRuleList.forEach(item => {
            if (item.costAlias == formData.costAlias && item.costProject == formData.costProject) {
                abstractRule = item;
                return;
            }
        })
        console.log(abstractRule, "----------------------");
        if (abstractRule != null) {
            if (abstractRule.costAffiliationDateFlag == 'Y') {
                if (formData.costAffiliationDate != undefined) {
                    value = value + formData.costAffiliationDate;
                }
            }
            //区域
            if (abstractRule.areaTypeFlag == 'Y') {
                if (areaSource != undefined) {
                    areaSource.forEach((item2: { areaType: string; }) => {
                        value = value + item2.areaType;
                    })
                }
            }
            if (abstractRule.costProjectFlag == 'Y') {
                value = value + formData.costProject;
            }
            if (abstractRule.remarkFlag == 'Y') {
                //备注
                if (formData.remark != undefined) {
                    value = value + formData.remark;
                }
            }
        }
        //单据类型
        if (formData.billType != undefined) {
           // formData.billType =="費用預估"
            if (formData.billType == billtype[0].value) {
                value = value + "预估";
            }
        }
        const summaryValue = value.replace("undefined", "");
        const summaryX = summaryValue.replace("null", "");
        setSummary(summaryX);
    }
    //给总金额赋值
    const setToTalMoneyValue = () => {
        const formValue = (form.current as any).getFieldsValue();
        const areaDatas: [] = formValue.areaData;
        let toTalMoneyValue: number = 0;
        if (areaDatas !== undefined) {
            if (areaDatas.length > 0) {
                areaDatas.forEach((item: any) => {
                    toTalMoneyValue = toTalMoneyValue + item.areaMoney * 1;
                })
                const money = Number(Number(toTalMoneyValue * 1).toFixed(2));
                setTotalMoney(Number(Number(toTalMoneyValue * 1).toFixed(2)));
                setFormData({ ...formData, totalMoney: money })
            }
        }
    }
    //点击汇总事件
    const collect = async () => {
        if (formData.companyAlias == '' || formData.costAlias == '' || formData.costProject == '') {
            message.error({
                content: "请先选择公司别/费用类别/费用项目",
                duration: 5,
                style: {
                    marginTop: '20vh',
                },
            });
            return;
        }
        var errorMessage1 = "";
        var errorMessage2 = "";
        var errorMessage3 = "";
        var errorMessage4 = "";
        let flag = true;
        const formValue = (form.current as any).getFieldsValue();
        const shareValue: [] = formValue.costDataSimple;
        //校验部门是否存在
        let abstractRule: CostRulesData = {};
        costRulesList.forEach(item => {
            if (item.costAlias == formData.costAlias && item.costProject == formData.costProject) {
                abstractRule = item;
                return;
            }
        })
        big: for (let i = 0; i < shareValue.length; i++) {
            let share: any = shareValue[i];
            if (share.money.indexOf(".") != -1) {
                if (share.money.toString().split(".")[1].length > 2) {
                    errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的金额-" + share.money + "只能填写两位小数" + " \r\n";
                    flag = false;
                }
            }
            //卡部门和挂账部门不为空
            if (share.departmentId == '' || share.departmentId == undefined) {
                errorMessage4 = "部门为必填项，请补全！！！";
            }
            // if (share.departmentId == '' || share.departmentId == undefined || share.buyerDepartment == '' || share.buyerDepartment == undefined) {
            //     errorMessage4 = "部门和挂账部门为必填项，请补全！！！";
            // }
            let data = await findDept2(share.departmentId, formData.companyAlias);
            if (data.code != 200) {
                errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的部门-" + share.departmentId + "不在此公司别下面或不存在" + " \r\n";
                flag = false;
            }
            // if (share.buyerDepartment !== undefined && share.buyerDepartment !== "") {
            //     let data2 = await findDept2(share.departmentId, formData.companyAlias);
            //     if (data2.code != 200) {
            //         errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的挂账部门-" + share.departmentId + "不在此公司别下面或不存在" + " \r\n";
            //         flag = false;
            //     }
            // }
            //如果区域不为必填项，则修改为空
            if (abstractRule.areaFlag == "Y") {
                if (share.areaName == '' || share.areaName == undefined) {
                    errorMessage2 = "此单据区域为必填项，请全部补全" + " \r\n";
                    flag = false;
                } else {
                    //1,首先判断是否存在此区域
                    var result_one = areaTypesList.some(function (item) {
                        if (item.areaName == share.areaName) { //item.name == "小百里守约"
                            shareValue[i].areaType = item.areaType;
                            return true;  //返回false
                        } else {
                            return false;  //返回false
                        }
                    })
                    if (result_one == false) {
                        errorMessage1 = errorMessage1 + "第" + (i + 1) + "行中的区域-" + share.areaName + "不存在" + " \r\n";
                        flag = false;
                    }
                }
            }
            //员工类型处理
            if (abstractRule.employeeTypeFlag == "Y" || shareValue[i].areaType == '宿舍') {
                if (share.employeeType == '' || share.employeeType == undefined) {
                    errorMessage2 = "此单据员工类型为必填项，请全部补全" + " \r\n";
                    flag = false;
                }
            } else {
                share.employeeType = "";
            }
        }
        //根据部门排序
        shareValue.sort(compare);
        if (flag == true) {
            detailedSummary(shareValue).then(res => {
                if (res.code == 200) {
                    setShareSource([]);
                    setDataSource([]);
                    setShareSource(shareValue);
                    setDataSource(res.data);
                    message.success({
                        content: res.message,
                        duration: 5,
                        style: {
                            marginTop: '20vh',
                        },
                    });
                } else {
                    message.error({
                        content: res.message,
                        duration: 5,
                        style: {
                            marginTop: '20vh',
                        },
                    });
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
    //根据费用类别和费用项目获取必填栏位
    const getAbstractRule = () => {
        //根据费用类别必填-必填规则
        const formValue = (form.current as any).getFieldsValue();
        let costAliasParam = "";
        let costProjectParam = "";
        if (formValue.costAlias != undefined && formValue.costProject != undefined) {
            costAliasParam = formValue.costAlias.value;
            costProjectParam = formValue.costProject.value;
        }
        let abstractRule: CostRulesData = {};
        costRulesList.forEach(item => {
            if (item.costAlias == costAliasParam && item.costProject == costProjectParam) {
                abstractRule = item;
                return;
            }
        })
        return abstractRule;
    }
    const clearData = () => {
        (form.current as any).setFieldsValue();
        setIndexCompany(-1);
        setIndexBilltype(-1);//初始化下拉框 
        setIndexCurrency(-1);//初始化下拉框 
        setIndexCostAlias(-1);//初始化下拉框 
        setIndexCostProject(-1);//初始化下拉框 
        setIndexTaxRate(-1);//初始化下拉框 
        setFormId("");
        setTotalMoney(0);
        setFormData({});
        setAreaSource([]);
        setDataSource([]);
        setShareSource([]);
        setBtnFlag(false);
        (signRef.current as any).hidden = true;
    }

    //小数相加
    const accAdd = (arg1: string | number, arg2: number) => {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) { r1 = 0 }

        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    }
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
    //当改变公司别或单据类型时
    const changCompanyOrBillType = (companyCode: string, billType: string) => {
        //清空数据
        (form.current as any).setFieldsValue({});
        setFormData({});
        setFormData({
            companyAlias: companyCode,
            billType: billType,
        });
        //清空下拉框
        if (billType == null || billType == undefined || billType == '') {
            setIndexBilltype(-1);
        }
        setIndexCostAlias(-1);
        setIndexCurrency(-1);
        setIndexCostAlias(-1);
        setIndexCostProject(-1);
        setIndexTaxRate(-1);
        //公司别
        const index = getArrayIndex(companyAliasList, companyCode);
        setIndexCompany(index);
        // 单据类型
        const index2 = getArrayIndex(billtype, billType);
        setIndexBilltype(index2);
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
    let title: string | null = null;
    return (
        <div>
            <Spin tip="暂存中..." spinning={loadingFlag}>
                <PageContainer>

                    <ProForm layout="horizontal" formRef={form}
                        onFinish={async (value) => {
                            //提交前判断数据准确性
                            await waitTime(2000);
                            formData.summary = summary;
                            let areaData: any;
                            if (value.areaData == undefined) {
                                areaData = areaSource;
                            } else {
                                areaData = value.areaData;
                            }
                            areaData.forEach((item: { id: undefined; attachId: undefined; }) => {
                                if (item.id !== undefined) {
                                    delete item.id;
                                }
                                if (item.attachId !== undefined) {
                                    delete item.attachId;
                                }
                            });
                            const abstractRule = getAbstractRule();
                            let flag = true;
                            if (abstractRule.areaFlag == 'Y') {
                                if (value.areaData.length == 0) {
                                    message.error({
                                        content: "请填写区域及金额",
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    return;
                                }
                                //二，金额核对(分区域核对)
                                let money1 = '0';//宿舍
                                let money2 = '0';//餐厅
                                let money3 = '0';//厂区
                                dataSource.forEach(item => {
                                    let obj: any = item;
                                    if (obj.areaType == areaTypeList[0].value) {
                                        money1 = accAdd(money1, obj.money).toFixed(2);
                                    }
                                    if (obj.areaType == areaTypeList[1].value) {
                                        money2 = accAdd(money2, obj.money).toFixed(2);
                                    }
                                    if (obj.areaType == areaTypeList[2].value) {
                                        money3 = accAdd(money3, obj.money).toFixed(2);
                                    }
                                })
                                for (var i = 0; i < areaData.length; i++) {
                                    if (areaData[i].areaType == areaTypeList[0].value) {
                                        if (areaData[i].areaMoney * 1 !== money1 * 1) {
                                            message.error({
                                                content: areaData[i].areaType + "金额与分摊明细中区域总金额不一致",
                                                duration: 5,
                                                style: {
                                                    marginTop: '20vh',
                                                },
                                            });
                                            flag = false;
                                            setLoadingFlag(false);
                                            break;
                                        }
                                    }
                                    if (areaData[i].areaType == areaTypeList[1].value) {
                                        if (areaData[i].areaMoney * 1 !== money2 * 1) {
                                            message.error({
                                                content: areaData[i].areaType + "金额与分摊明细中区域总金额不一致",
                                                duration: 5,
                                                style: {
                                                    marginTop: '20vh',
                                                },
                                            });
                                            flag = false;
                                            setLoadingFlag(false);
                                            break;
                                        }
                                    }
                                    if (areaData[i].areaType == areaTypeList[2].value) {
                                        if (areaData[i].areaMoney * 1 !== money3 * 1) {
                                            message.error({
                                                content: areaData[i].areaType + "金额与分摊明细中区域总金额不一致",
                                                duration: 5,
                                                style: {
                                                    marginTop: '20vh',
                                                },
                                            });
                                            setLoadingFlag(false);
                                            flag = false;
                                            break;
                                        }
                                    }
                                }
                                let total = '0';
                                total = accAdd(total, money1 * 1).toFixed(2);
                                total = accAdd(total, money2 * 1).toFixed(2);
                                total = accAdd(total, money3 * 1).toFixed(2);
                                if (formData.totalMoney * 1 !== total * 1) {
                                    message.error({
                                        content: "总金额与区域总金额不一致",
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    setLoadingFlag(false);
                                    return;
                                }
                            }
                            if (flag == false) {
                                setLoadingFlag(false);
                                return;
                            }
                            //一，必填栏位校准(根据单据类型)
                            if (formData.billType == 'PA分攤') {
                                if (formData.paNumber === undefined || formData.paNumber == "") {
                                    message.error({
                                        content: '请输入PA号码',
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    setLoadingFlag(false);
                                    return;
                                }
                                if (formData.taxRate === undefined || formData.taxRate == "") {
                                    message.error({
                                        content: '请选择税率',
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    setLoadingFlag(false);
                                    return;
                                }
                                if (formData.invoiceNumber === undefined || formData.invoiceNumber == "") {
                                    message.error({
                                        content: '请输入发票号码',
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    setLoadingFlag(false);
                                    return;
                                }
                                if (formData.invoiceDate === undefined || formData.invoiceDate.value == "") {
                                    message.error({
                                        content: '请输入发票日期',
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    setLoadingFlag(false);
                                    return;
                                }
                            }
                            //判断费用分摊明细是否填写
                            if (dataSource.length == 0 || shareSource.length == 0) {
                                message.error({
                                    content: "请填写费用分摊明细或请汇总分摊明细",
                                    duration: 5,
                                    style: {
                                        marginTop: '20vh',
                                    },
                                });
                                setLoadingFlag(false);
                                return;
                            }
                            let money = '0';
                            dataSource.forEach((item: any) => {
                                money = accAdd(money, item.money).toFixed(2);
                            })
                            if (formData.totalMoney * 1 !== money * 1) {
                                message.error({
                                    content: "总金额与分摊明细总金额不一致",
                                    duration: 5,
                                    style: {
                                        marginTop: '20vh',
                                    },
                                });
                                setLoadingFlag(false);
                                return;
                            }
                            let list: any = {
                                epaEstimateApportionMain: {},
                                estimateApportionAttach1s: {},
                                epaEstimateApportionDetails: {},
                                epaEstimateApportionDetails2: {},
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
                            list.epaEstimateApportionMain = formData;
                            list.estimateApportionAttach1s = areaData;
                            list.epaEstimateApportionDetails = shareSource;
                            list.epaEstimateApportionDetails2 = dataSource;
                            console.log(formData, "----------formData");
                            console.log(list, "----------LIST");
                            await saveCostEstimateApportionForm(list).then((res: any) => {
                                if (res.code == 200) {
                                    setLoadingFlag(false);
                                    setFormId(res.data);
                                    setFormData({ ...formData, formId: res.data });
                                    message.success({
                                        content: '提交成功',
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                    if (title == 'sendOut' && res.data != "" && res.data != undefined) {
                                              // formData.billType =="費用預估"
                                        if (formData.billType ==  billtype[0].value) {
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
                                        else {
                                            setInitialValues({
                                                autoGenerateRefenceId: false,
                                                dictKey: 'finance.epa.signToFinance',
                                                referenceId: res.data,
                                                mode: "edit",
                                                // callBackUrl:getUrl(8000),
                                                callBackUrl: getUrl('com'),
                                                category: "财务",
                                                subCategory: "epa",
                                                item: formData.billType,
                                            });
                                        }

                                    };
                                } else {
                                    message.success({
                                        content: res.message,
                                        duration: 5,
                                        style: {
                                            marginTop: '20vh',
                                        },
                                    });
                                }
                            });
                        }}
                        submitter={{
                            // 完全自定义整个区域
                            render: (props, doms) => {
                                return [
                                    <Button type="primary" key="rest" hidden={btnHiddenFlag} onClick={() => {
                                        props.form?.resetFields();
                                        clearData();

                                    }}>
                                        新增
                                    </Button>,
                                    <Button type="primary" key="submit" disabled={btnFlag} hidden={btnHiddenFlag} onClick={() => {
                                        setLoadingFlag(true);
                                        title = "暂存", props.form?.submit?.()
                                    }}>
                                        暂存
                                    </Button>,
                                    <Button type="primary" key="submit" disabled={btnFlag} hidden={btnHiddenFlag} onClick={async () => {
                                        title = "sendOut", props.form?.submit?.()
                                    }}>
                                        送出 
                                    </Button>,
                                    <Button type="primary" disabled={btnFlag} hidden={btnHiddenFlag} onClick={async () => {
                                        if (formData.formId == "" || formData.formId == undefined) {
                                            message.error({
                                                content: "此单据未保存，可直接新增单据，无需作废",
                                                duration: 5,
                                                style: {
                                                    marginTop: '20vh',
                                                },
                                            });
                                            return;
                                        }
                                        await cancellation(formData.formId).then(res => {
                                            if (res.code == 200) {
                                                message.success({
                                                    content: res.message,
                                                    duration: 5,
                                                    style: {
                                                        marginTop: '20vh',
                                                    },
                                                });
                                            } else {
                                                message.error({
                                                    content: res.message,
                                                    duration: 5,
                                                    style: {
                                                        marginTop: '20vh',
                                                    },
                                                });
                                            }
                                        });
                                    }}>
                                        取消
                                    </Button>,
                                ];
                            },
                        }}
                    >
                        <ProForm.Group>
                            <ProFormSelect
                                width='sm'
                                fieldProps={{
                                    value: companyAliasList[indexCompany],
                                    labelInValue: true,
                                    onChange: (e) => {
                                        setFormData({ ...formData, companyAlias: (e.value as string) });
                                        setCostAliasList([]);
                                        setCostProjectList([]);
                                        initAreaType(e.value as string);
                                        initAbstractRule(e.value as string);
                                        initCompanyAlias(e.value as string);
                                        //二次进入时，
                                        const index = getArrayIndex(companyAliasList, e.value);
                                        setIndexCompany(index);
                                        changCompanyOrBillType(e.value as string, '');
                                    }
                                }}
                                valueEnum={() => {
                                    const options = {};
                                    companyAliasList.forEach((item: any) => {
                                        options[item.value] = item.label
                                    });
                                    return options;
                                }}
                                // options={companyAliasList}
                                name="companyAlias"
                                label="公司别"
                                rules={[{ required: true, message: '请选择公司别!' }]}
                                placeholder='请选择公司别'
                            />
                            <ProFormSelect
                                width="sm"
                                fieldProps={{
                                    value: billtype[indexBilltype],
                                    labelInValue: true,
                                    onChange: (e) => {
                                        setFormData({ ...formData, billType: e.value });
                                        getCostAlias(formData.companyAlias, e.value);
                                        if (e.value == 'PA分攤') {
                                            (paRef.current as any).hidden = false;
                                        } else {
                                            (paRef.current as any).hidden = true;
                                        }
                                        //二次进入时，
                                        const index = getArrayIndex(billtype, e.value);
                                        setIndexBilltype(index);
                                        changCompanyOrBillType(formData.companyAlias, e.value);
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
                                disabled
                                placeholder='表单保存后自动生成'
                                fieldProps={{
                                    value: formId,
                                    onChange: (e) => {
                                        setFormData({ ...formData, formId: formId });
                                    }
                                }}

                            />
                            <ModalForm
                                title="区域明细"
                                width={85 + '%'}
                                hidden={areaModelFlag}
                                trigger={
                                    <div style={{ marginTop: -25 }}>
                                        <Button type="primary" onClick={async () => {

                                        }}>查看区域明细</Button>
                                    </div>
                                }
                                submitter={{
                                    submitButtonProps: {
                                        style: {
                                            display: 'none',
                                        },
                                    },

                                }}
                                onFinish={async (values) => {
                                    message.success('提交成功');
                                    return true;
                                }}
                            >
                                <Table columns={columnsArea} dataSource={areaSource}
                                />
                            </ModalForm>
                        </ProForm.Group>
                        <ProForm.Group>
                            <ProFormSelect
                                width="sm"
                                fieldProps={{
                                    value: costAliasList[indexCostAlias],
                                    labelInValue: true,
                                    onChange: (e) => {
                                        setFormData({ ...formData, costAlias: e.value });
                                        getCostProject(formData.companyAlias, formData.billType, e.value as string);
                                        // getCostProjectList(e.value);
                                        //二次进入时，
                                        const index = getArrayIndex(costAliasList, e.value);
                                        setIndexCostAlias(index);
                                    }
                                }}
                                valueEnum={() => {
                                    const options = {};
                                    costAliasList.forEach((item: any) => {
                                        options[item.value] = item.label
                                    });
                                    return options;
                                }}
                                // options={costAliasList}
                                name="costAlias"
                                label="费用类别"
                                rules={[{ required: true, message: '请选择费用类别!' }]}
                                placeholder='请选择费用类别'
                            />
                            <ProFormSelect
                                width="sm"
                                ref={costProjectRef}
                                fieldProps={{
                                    value: costProjectList[indexCostProject],
                                    labelInValue: true,
                                    onChange: (e) => {
                                        setFormData({ ...formData, costProject: e.value });
                                        costRulesList.forEach(item => {
                                            if (item.costProject == e.value) {
                                                //区域是否显示
                                                if (item.areaFlag == 'Y') {
                                                    (areaRef.current as any).hidden = false;
                                                    (form.current as any).setFieldsValue({ areaData: [] });
                                                    setTotalMoneyFlag(true);
                                                    return;
                                                } else {
                                                    (areaRef.current as any).hidden = true;
                                                    setTotalMoneyFlag(false);
                                                    return;
                                                }
                                            }
                                            const index = getArrayIndex(costProjectList, e.value);
                                            setIndexCostProject(index);
                                        })
                                    }
                                }}
                                options={costProjectList}
                                name="costProject"
                                label="费用项目"
                                rules={[{ required: true, message: '请选择费用项目!' }]}
                                // required={true}
                                placeholder='请选择费用项目'
                            />
                            <ProFormDatePicker.Month width="sm" name="costAffiliationDate" label="归属年月"
                                fieldProps={{
                                    format: 'YYYYMM',
                                    onChange: (e) => {
                                        setFormData({ ...formData, costAffiliationDate: e?.format("YYYYMM") ? e?.format("YYYYMM") : '' });
                                    }
                                }}
                                rules={[{
                                    required: true, message: '请选择费用归属年月!'
                                }]} />
                            <ModalForm
                                title="费用分摊明细"
                                width={85 + '%'}
                                hidden={costModelFlag}
                                trigger={
                                    <div style={{ marginTop: -25 }}>
                                        <Button type="primary" onClick={async () => {

                                        }}>查看费用分摊明细</Button>
                                    </div>
                                }
                                submitter={{
                                    render: (props, doms) => {
                                        return <Button type="primary" onClick={downloadData2}>
                                            下载
                                        </Button>
                                    }

                                }}
                                onFinish={async (values) => {
                                    message.success('提交成功');
                                    return true;
                                }}

                            >
                                <Table pagination={{ pageSize: 6 }}
                                    columns={columns2} dataSource={dataSource} />
                            </ModalForm>
                        </ProForm.Group>
                        <ProForm.Group ref={paRef}>
                            <ProFormText
                                width="sm"
                                name="paNumber"
                                label="PA号码"
                                tooltip="選擇費用分攤時顯示"
                                placeholder="请输入PA号码"
                                ref={paXRef}
                                rules={[{ required: false }]}
                                fieldProps={{
                                    onChange: (e) => {
                                        setFormData({ ...formData, paNumber: e.target.value });
                                    }
                                }}
                            />
                            <ProFormSelect
                                width="sm"
                                fieldProps={{
                                    value: taxRateList[indexTaxRate],
                                    labelInValue: true,
                                    onChange: (e) => {
                                        value: e.value,
                                            setFormData({ ...formData, taxRate: e.value });
                                        //二次进入时
                                        const index = getArrayIndex(taxRateList, e.value);
                                        setIndexTaxRate(index);
                                    }
                                }}
                                valueEnum={() => {
                                    const options = {};
                                    taxRateList.forEach((item: any) => {
                                        options[item.value] = item.label
                                    });
                                    return options;
                                }}
                                // options={taxRateList}
                                name="taxRate"
                                label="税率"
                                placeholder="请选择税率"
                                // ref={paXRef}
                                rules={[{ required: false }]}
                            />

                            <ProFormDatePicker width="sm" name="invoiceDate" label="发票日期"
                                rules={[{ required: false }]}
                                fieldProps={{
                                    onChange: (e) => {
                                        setFormData({ ...formData, invoiceDate: e?.format("YYYY-MM-DD") ? e?.format("YYYY-MM-DD") : '' });
                                    }
                                }}
                            />
                            <ProFormText
                                width="sm"
                                name="invoiceNumber"
                                label="发票号码"
                                tooltip="選擇費用分攤時顯示"
                                placeholder="请输入发票号码"
                                rules={[{ required: false }]}
                                fieldProps={{
                                    onChange: (e) => {
                                        setFormData({ ...formData, invoiceNumber: e.target.value });
                                    }
                                }}
                            />
                        </ProForm.Group>
                        <ProForm.Group ref={areaRef} >
                            <ProForm.Item
                                name="areaData"
                                trigger="onValuesChange"
                            >
                                <EditableProTable
                                    headerTitle="区域明细"
                                    name="areaData"
                                    rowKey="id"
                                    actionRef={areasRef}
                                    onChange={setAreaSource}
                                    value={areaSource}
                                    maxLength={3}
                                    toolBarRender={() => [
                                        <div style={{ width: 100 + '%', marginRight: 0 }}>
                                            <Button type="primary" disabled={btnFlag} onClick={() => {
                                                setAreaSource([]);
                                            }}>
                                                清空
                                            </Button>
                                        </div>
                                    ]}
                                    request={(params, sorter, filter) => {
                                        return Promise.resolve({
                                            data: areaSource,
                                            success: true,
                                        });
                                    }}
                                    columns={columnsArea}
                                    recordCreatorProps={{
                                        newRecordType: 'dataSource',
                                        position: 'bottom',  //top
                                        record: () => ({
                                            id: Date.now(),
                                        }),
                                    }}
                                    editable={{
                                        type: 'multiple',
                                        editableKeys,
                                        onChange: setEditableRowKeys,
                                        // actionRender: (row, _, dom) => {
                                        //     return [dom.delete];
                                        // },
                                        onSave: async () => {
                                            await waitTime(2000);
                                            setNewRecord({
                                                id: (Math.random() * 1000000).toFixed(0),
                                            });
                                            setSummaryValue();
                                            setToTalMoneyValue();
                                        },
                                    }}
                                />
                            </ProForm.Item>
                        </ProForm.Group>
                        <ProForm.Group>
                            <ProFormSelect
                                width="xs"
                                fieldProps={{
                                    value: currencyList[indexCurrency],
                                    labelInValue: true,
                                    onChange: async (e) => {
                                        value: e.value,
                                            setFormData({ ...formData, currency: e.value });
                                        await waitTime(2000);
                                        // setToTalMoneyValue();
                                        //二次进入时，
                                        const index = getArrayIndex(currencyList, e.value);
                                        setIndexCurrency(index);
                                    }
                                }}
                                valueEnum={() => {
                                    const options = {};
                                    currencyList.forEach((item: any) => {
                                        options[item.value] = item.label
                                    });
                                    return options;
                                }}
                                // options={currencyList}
                                name="currency"
                                label="币别"
                                rules={[{ required: true, message: '请选择币别!' }]}
                                placeholder='请选择币别'
                            />
                            <ProFormDigit
                                width="sm"
                                readonly={totalMoneyFlag}
                                name="totalMoney"
                                label="总金额"
                                tooltip="只保留两位小数"
                                placeholder="请输入总金额（只保留两位小数）"
                                // rules={[{ required: true, message: '请输入总金额!' }]}
                                fieldProps={{
                                    precision: 2,
                                    value: totalMoney,
                                    onChange: (e) => {
                                        const param: number = Number(Number(e).toFixed(2));
                                        setTotalMoney(param);
                                        setFormData({ ...formData, totalMoney: param });
                                    }
                                }}
                            />
                            <ProFormText
                                width="sm"
                                name="remark"
                                label="备注"
                                tooltip="最长30个字符"
                                placeholder="请输入备注"
                                fieldProps={{
                                    onChange: (e) => {
                                        setFormData({ ...formData, remark: e.currentTarget.value });
                                    }
                                }}
                                rules={[{ required: false, min: 0, max: 30, message: '最长30个字符!', }]}
                            />
                            <ProFormText
                                width="md"
                                name="summary"
                                label="摘要显示"
                                fieldProps={{
                                    value: summary,
                                    // onChange: (e) => {
                                    //     setFormData({ ...formData, summary: e.target.value });
                                    // }
                                }}
                                readonly
                                placeholder="自动带出"
                            />
                        </ProForm.Group>
                        <ProForm.Group ref={hiddenRef}>
                            <ProForm.Item
                                name="costDataSimple"
                                trigger="onValuesChange"
                            >
                                <EditableProTable
                                    rowKey="id"
                                    name="costDataSimple"
                                    actionRef={shareRef}
                                    headerTitle="费用分摊明细"
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
                            </ProForm.Item>
                        </ProForm.Group>
                        <ProForm.Group ref={hidden2Ref}>
                            <ProForm.Item
                                name="costDataTotal"
                                trigger="onValuesChange"
                            >
                                <EditableProTable
                                    actionRef={huiRef}
                                    name="costDataTotal"
                                    headerTitle="最终汇总明細"
                                    rowKey="id"
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
                            </ProForm.Item>
                        </ProForm.Group>
                    </ProForm>
                    <ProCard hidden={false} style={{ marginTop: 15 }} ref={signRef}>
                        <OASignComponent ref={signsRef}
                            initialValues={initialValues}
                            onCreate={
                                {
                                    success: async (data) => {
                                        const result = await changeFinanceSign(formData.formId);
                                        console.log(result, "修改签核后result");
                                        if (result.code == 200) {
                                            //改变单据状态
                                            (signRef.current as any).hidden = false;
                                            changeState(formId, "signing", initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
                                            message.success({
                                                content: "送出成功",
                                                duration: 5,
                                                style: {
                                                    marginTop: '20vh',
                                                },
                                            });
                                            // (signsRef.current as any).reload();
                                            // window.location.reload();
                                        }
                                    },
                                    fail: async (referenceId, message) => {
                                    }
                                }
                            }
                            onApprove={{
                                success: async (data) => {
                                    if (data[data.length - 2].actualSignStatus == 'P'&& data[data.length - 1].actualSignStatus !== 'P') {
                                        changeState(formId, "financeSigned", initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
                                    }
                                    if (data[data.length - 1].actualSignStatus !== 'P') {
                                        changeState(formId, "signed", initialState?.currentUser?.employeeInfoDTO?.emplid ? initialState?.currentUser?.employeeInfoDTO?.emplid : '');
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
                </PageContainer>
            </Spin>
        </div >
    )
}
export default CostEstimateApportion;


