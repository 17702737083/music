import React, { useEffect, useState } from 'react'
import ProForm, {
    ProFormText,
    ProFormDatePicker,
    ProFormSelect,
    ProFormDigit,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Upload } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import Icon, { UploadOutlined } from '@ant-design/icons';
import { findSelect } from './service';
import './index.less'
import { downloadTemplate } from '../CostEstimateApportion/service';
import * as xlsx from 'xlsx'
import { findAllCompany } from '../../epaBaseData/Company/service';
import { CompanyData, CompanySource, CurrencySource, OptionsData } from '../../data';
import { findAllCurrency } from '../../epaBaseData/Currency/service';
import { epaServiceUrl } from '@/components/OA/serviceUrl';
import OAFileUpload from '@/components/OA/OAFileUpload';
import ProCard from '@ant-design/pro-card';

//缴款单
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

const columns: ProColumns<DataSourceType>[] = [
    {
        title: '缴款类别',
        dataIndex: 'payInType',
        width: '15%',
        valueType: 'text',
    },
    {
        title: '缴款项目',
        key: 'state',
        dataIndex: 'payInProject',
        width: '15%',
        valueType: 'text',
    },
    {
        title: '区域',
        key: 'state',
        dataIndex: 'areaName',
        width: '15%',
        valueType: 'select',
        valueEnum: {
            all: { text: '全部', status: 'Default' },
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
            },
        },
    },
    {
        title: '员工类型',
        dataIndex: 'employeeType',
        width: '15%',
        valueType: 'select',
        valueEnum: {
            DL: {
                text: 'DL',
            },
            IDL: {
                text: 'IDL',
            },
        },
    },
    {
        title: '部门',
        width: '15%',
        dataIndex: 'departmentId',
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
        width: '5%',
        valueType: 'option',
    },
];


const columnsHui: ProColumns<DataSourceType>[] = [
    {
        title: '缴款类别',
        dataIndex: 'payInType',
        width: '15%',
        valueType: 'text',
    },
    {
        title: '缴款项目',
        key: 'state',
        dataIndex: 'payInProject',
        width: '15%',
        valueType: 'text',
    },
    {
        title: '区域',
        key: 'state',
        dataIndex: 'areaName',
        width: '15%',
        valueType: 'select',
        valueEnum: {
            all: { text: '全部', status: 'Default' },
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
            },
        },
    },
    {
        title: '员工类型',
        dataIndex: 'employeeType',
        width: '15%',
        valueType: 'select',
        valueEnum: {
            DL: {
                text: 'DL',
            },
            IDL: {
                text: 'IDL',
            },
        },
    },
    {
        title: '部级以上部门',
        width: '15%',
        dataIndex: 'departmentId',
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
        width: '5%',
        valueType: 'option',
    },
];
//缴款单
const DemandNote: React.FC = () => {

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
        defaultData.map((item) => item.id),
    );
    //存储单据信息（验证/绑定数据/保存）
    const [formData, setFormData]: any = useState({
        formId: '',
        companyAlias: '',
        billType: '缴款单',
        currency: 'RMB',
        totalMoney: 0,
        bankTransferId: '',
        costAffiliationDate: '',
        payInPersonType: '',
        payInPerson: '',
        bankPayInPerson: '',
        payInContext: '',
        state: '',
        crdate: '',
        cruser: '',
        updateTime: '',
        updateUser: '',
        departmentId: '',
        remark: '',
    });//单据信息
    const [paymentPeopleTypes, setPaymentPeopleTypes] = useState([]);

    const [btnFlag, setBtnFlag] = useState(false);
    const [companList, setCompanyList] = useState<CompanyData[]>([]);//公司別
    const [sapCompanyCodeList, setSapCompanyCodeList] = useState<OptionsData[]>([]);//公司別-下拉框
    const [currencyList, setCurrencyList] = useState<OptionsData[]>([]);//币别

    useEffect(() => {
        initSelect();     //初始化下拉表
        initCompany();    //初始化公司别 
        initCurrency();  //初始化币别
    }, []);

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
        companyCodeList = deWeight(companyCodeList);
        setSapCompanyCodeList(companyCodeList);
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

    //初始化缴款人类型
    const initSelect = async () => {
        const list = await findSelect("paymentPeople");
        if (list.code == 200) {
            setPaymentPeopleTypes(list.data);
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
    //下载模板
    const downloadTemplateFt = () => {
        downloadTemplate("EJ");
    }
    const uploadprops = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        showUploadList: false,
        beforeUpload: (file: Blob, fileList: any) => {
            // (form.current as any).setFieldsValue({costDataSimple:[]});
            // console.log(file.name);
            const fileReader = new FileReader();
            var data: any = [];
            fileReader.onload = async event => {
                const bstr = (event.target as any).result;
                const workbook = xlsx.read(bstr, { type: 'binary' });
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        // 利用 sheet_to_json 方法将 excel 转成 json 数据
                        data = data.concat(xlsx.utils.sheet_to_json(workbook.Sheets[sheet]));
                        break; // 如果只取第一张表，就取消注释这行
                    }
                }
                console.log(data);
            }
            fileReader.readAsBinaryString(file);
        },
    };
    //下载表格数据
    const downloadData = () => {
        const aoa = [
            ['序号', '部门代码', '区域', '员工类型',
                '績效調整掛帳部門', 'BU代碼', '金额', '备注说明']
        ]
        // shareSource.forEach((item: any, index: number) => {
        //     aoa[Number(index + 1)] = [
        //         `${index + 1}`,
        //         `${item.departmentId ? item.departmentId : ''}`,
        //         `${item.areaName ? item.areaName : ''}`,
        //         `${item.employeeType ? item.employeeType : ''}`,
        //         `${item.buyerDepartment ? item.buyerDepartment : ''}`,
        //         `${item.buId ? item.buId : ''}`,
        //         `${item.money ? item.money : ''}`,
        //         `${item.remark ? item.remark : ''}`,
        //     ];
        // })
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
    let title: string | null = null;
    return (
        <div>
            <PageContainer >
                <ProForm layout="horizontal"
                    onFinish={async (values) => {
                        await waitTime(2000);
                        console.log(values);
                        console.log(formData, "    console.log(formData);");
                        message.success('提交成功');
                    }}
                    submitter={{
                        // 完全自定义整个区域
                        render: (props, doms) => {
                            return [
                                <Button type="primary" key="rest" hidden={btnFlag} onClick={() => {
                                    props.form?.resetFields();
                                }}>
                                    新增
                                </Button>,
                                <Button type="primary" key="submit" disabled={btnFlag} hidden={btnFlag} onClick={() => {
                                    title = "暂存", props.form?.submit?.()
                                }}>
                                    暂存
                                </Button>,
                                <Button type="primary" key="submit" disabled={btnFlag} hidden={btnFlag} onClick={async () => {
                                    title = "送出", props.form?.submit?.()
                                }}>
                                    送出
                                </Button>,
                                <Button type="primary" disabled={btnFlag} hidden={btnFlag} onClick={async () => {

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
                                labelInValue: true,
                                onChange: (e) => {
                                    setFormData({ ...formData, companyAlias: (e.value as string) });
                                }
                            }}
                            valueEnum={() => {
                                const options = {};
                                sapCompanyCodeList.forEach((item: any) => {
                                    options[item.value] = item.label
                                });
                                return options;
                            }}
                            name="companyAlias"
                            label="公司别"
                            rules={[{ required: true, message: '请选择公司别!' }]}
                            placeholder='请选择公司别'
                        />
                        <ProFormText
                            name="billType"
                            width="sm"
                            disabled
                            label="单据类型"
                            initialValue="缴款单"
                        />

                        <ProFormText
                            width="sm"
                            disabled
                            name="formId"
                            label="单号"
                            placeholder='表单保存后自动生成'
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                labelInValue: true,
                                onChange: (e) => {
                                    setFormData({ ...formData, currency: (e.value as string) });
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
                            label="币别"
                            initialValue="RMB"
                            rules={[{ required: true, message: '请选择币别!' }]}
                            placeholder='请选择币别'
                        />

                        <ProFormDigit
                            width="sm"
                            name="totalMoney"
                            label="总金额"
                            placeholder="请输入总金额（只保留两位小数）"
                            fieldProps={{
                                precision: 2,
                                // value: formData.totalMoney,
                                onChange: async (e) => {
                                    const param: number = Number(Number(e).toFixed(2));
                                    setFormData({ ...formData, totalMoney: param });
                                }
                            }}
                            rules={[{ required: true, message: '请输入总金额!' }]}
                        />
                        <ProFormText
                            width="sm"
                            fieldProps={{
                                onChange: (e) => {
                                    setFormData({ ...formData, bankTransferId: e.target.value });
                                }
                            }}
                            name="bankTransferId"
                            label="银行转账单号"
                            tooltip="最长30位"
                            placeholder="请输入名称"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormDatePicker.Month
                            width="sm"
                            name="costAffiliationDate"
                            label="费用归属年月"
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

                        <ProFormSelect
                            width="sm"
                            fieldProps={{
                                labelInValue: true,
                                onChange: (e) => {
                                    setFormData({ ...formData, payInPersonType: (e.value as string) });
                                }
                            }}
                            valueEnum={() => {
                                const option = {};
                                paymentPeopleTypes.forEach((item: any) => {
                                    option[item.selectValue] = item.selectValue
                                });
                                return option;
                            }}
                            name="payInPersonType"
                            label="实际缴款人类型"
                        />
                        <ProFormText
                            width="sm"
                            fieldProps={{
                                onChange: (e) => {
                                    setFormData({ ...formData, payInPerson: e.target.value });
                                }
                            }}
                            name="payInPerson"
                            label="实际缴款人"
                            tooltip=""
                            placeholder="请输入工号或代码"
                        />
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText
                            width="sm"
                            fieldProps={{
                                onChange: (e) => {
                                    setFormData({ ...formData, bankPayInPerson: e.target.value });
                                }
                            }}
                            name="bankPayInPerson"
                            label="银行缴款单缴款人"
                        />


                        <ProFormText
                            width="md"
                            fieldProps={{
                                onChange: (e) => {
                                    setFormData({ ...formData, payInContext: e.target.value });
                                }
                            }}
                            name="payInContext"
                            label="缴款内容"
                            tooltip="最多50个字"
                            placeholder="请输入缴款内容"
                        />
                        <div style={{marginBottom:25}}>
                            <OAFileUpload
                                // uploadColumns={uploadColumns}
                                uploadColumns={[]}
                                showTabs={["normal"]}
                                referenceId="1111"
                                title="1，上传银行转账回单(图片/PDF),
                                            2，上传附件(签呈/合同等)"
                                mode="button"  //tab  button
                                onExcelFinish={{
                                    success: async data => {

                                        // const result = data as TruckPlanInfo[];

                                        // for (let i = 0; i < result.length; i++) {
                                        //     const truckPlanInfo = result[i];
                                        //     console.log(truckPlanInfo.driverId, truckPlanInfo);
                                        // }             
                                        console.log("received result from upload component", data)
                                    }
                                }} />
                        </div>
                    </ProForm.Group>


                    <ProForm.Item
                        name="dataSource"
                        initialValue={defaultData}
                        trigger="onValuesChange"
                    >
                        <EditableProTable<DataSourceType>
                            rowKey="id"
                            headerTitle="缴款单明細"
                            toolBarRender={() => [
                                <div style={{ width: 100 + '%', marginRight: 0 }}>
                                    <div style={{ marginRight: 0 }}>
                                        <Upload {...uploadprops} disabled={btnFlag} >
                                            <Button type="ghost" disabled={btnFlag}>
                                                <Icon type="upload" /> 点击上传
                                            </Button>
                                        </Upload>
                                        <Button type="primary" disabled={btnFlag} onClick={downloadTemplateFt}>
                                            上传模板
                                        </Button>
                                    </div>
                                </div>
                            ]}
                            columns={columns}
                            recordCreatorProps={{
                                newRecordType: 'dataSource',
                                position: 'bottom',
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
                    <ProForm.Item
                        // label="最终合计明细"
                        name="dataSource"
                        initialValue={defaultData}
                        trigger="onValuesChange"
                    >
                        <EditableProTable<DataSourceType>
                            rowKey="id"
                            headerTitle="最终合计明细"
                            toolBarRender={() => [
                            ]}
                            columns={columnsHui}
                            recordCreatorProps={{
                                newRecordType: 'dataSource',
                                position: 'bottom',
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
                </ProForm>
            </PageContainer>
        </div>
    )
}
export default DemandNote;
