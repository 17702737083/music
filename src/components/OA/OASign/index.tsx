import React, { useEffect, useState } from 'react';
import { Button, message, Tag, Input, Select } from 'antd';
import ProCard from '@ant-design/pro-card';
import { useIntl } from 'umi';
import { OASignComponentProps, OASignInitialProps, SignRecordDTO } from './data';
import { generateSignRecordListByDictKey, getSignRecordListByReferenceId, approve, reject } from './service';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';



const OASignComponent: React.FC<OASignComponentProps> = (props) => {
    const [comment, setComment] = useState('');

    useEffect(() => {
        console.log("侦测到mode有变化", props.initialValues?.mode);
        setMode(props.initialValues?.mode);
    }, [props.initialValues?.mode]);


    useEffect(async () => {
        console.log("侦测到referenceId有变化");
        console.log(props.initialValues?.referenceId);

        console.log(mode);
        if (props.initialValues?.referenceId) {
            // if (mode != "sign") {
            //     console.log("当前不是sign mode。不会触发流程获取。")
            //     return;
            // }
            setReferenceId(props.initialValues?.referenceId);
            const result = await getSignRecordListByReferenceId(props.initialValues?.referenceId as string);
            console.log(result);
            if (result.errorCode === 0) {
                if (result.data && result.data?.list && result.data?.list.length > 0) {
                    setSignRecordDTOList(result.data?.list as SignRecordDTO[]);
                    props.onQuery && props.onQuery.success && props.onQuery.success(result.data?.list as SignRecordDTO[]);
                } else {
                    //message.error("未获取到签核流程");
                }
            } else {
                message.error(result.errorMessage);
            }
        }

    }, [props.initialValues?.referenceId]);



    useEffect(async () => {
        console.log("侦测到dictKey有变化");
        console.log(props.initialValues?.dictKey);
        if (props.initialValues?.dictKey && props.initialValues?.mode == "edit") {
            if (!props.initialValues.autoGenerateRefenceId && !props.initialValues.referenceId) {
                message.error("没有绑定关联单号。请先绑定关联单号。或者设定autoGenerateRefenceId:true");
                return;
            }
            if (!props.initialValues.callBackUrl) {
                message.error("未绑定签核路径");
                return;
            }
            if (!props.initialValues.category || !props.initialValues.subCategory || !props.initialValues.item) {
                message.error("请绑定大类小类以及细项");
                return;
            }
            const result = await generateSignRecordListByDictKey(
                props.initialValues?.dictKey, props.initialValues?.referenceId, props.initialValues.callBackUrl,
                props.initialValues?.category, props.initialValues.subCategory, props.initialValues?.item);
            console.log(result);
            if (result.errorCode === 0) {
                if (result.data && result.data?.list && result.data?.list.length > 0) {
                    setReferenceId(result.data?.list[0].referenceId as string);
                    setSignRecordDTOList(result.data?.list as SignRecordDTO[]);
                    props.onCreate && props.onCreate.success && props.onCreate.success(result.data?.list as SignRecordDTO[]);
                }

            } else {
                message.error(result.errorMessage);
            }
        }

    }, [props.initialValues?.dictKey]);





    const intl = useIntl();

    const [initialProps, setInitialPros] = useState<OASignInitialProps>({
        mode: "sign",
        showApproveButton: true,
        showCommentTextArea: true,
        showInviteButton: true,
        showRejectButton: true,
        approveButtonText: "Approve",
        rejectButtonText: "Reject",
        ...props.initialValues
    });

    const [signRecordDTOList, setSignRecordDTOList] = useState<SignRecordDTO[]>([]);

    const [referenceId, setReferenceId] = useState("");

    const [mode, setMode] = useState<OASignInitialProps["mode"]>("edit");

    const columns: ProColumns<SignRecordDTO>[] = [
        {
            title: '签核步骤',
            dataIndex: 'step',
        }, {
            title: '签核步骤',
            dataIndex: 'stepName',
        }, {
            title: '原始签核人',
            dataIndex: 'signerEmployeeNameListString',
            render: (dom, entity, index) => {
                return (entity.onlyOneSigner
                    && entity.signerEmployeeEnNameList
                    && entity.signerEmployeeEnNameList?.length > 1) ?
                    <Select style={{ width: 150 }} >
                        {entity.signerEmployeeEnNameList?.map((item, index) => {
                            return <Select.Option key={index} value={item}>{item}</Select.Option>
                        })}
                    </Select>
                    : <span>{entity.signerEmployeeEnNameListString}</span>
            }
        }, {
            title: '实际签核人',
            dataIndex: 'actualSignEmployeeName',
        }, {
            title: '实际签核人英文名',
            dataIndex: 'actualSignEmployeeEnName',
        },
        {
            title: '签核状态',
            dataIndex: 'actualSignStatus',
            render: (_, record) => {
                switch (record.actualSignStatus) {
                    case "A":
                        return <Tag icon={<CheckCircleOutlined />} color="success">
                            已同意
                        </Tag>
                        break;
                    case "P":
                        return <Tag icon={<SyncOutlined />} color="processing">
                            进行中
                        </Tag>
                        break;
                    case "R":
                        return <Tag icon={<CloseCircleOutlined />} color="error">
                            已驳回
                        </Tag>
                        break;
                    case "X":
                        return <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            已作废
                        </Tag>
                        break;
                    case "N":
                        return <Tag icon={<ClockCircleOutlined />} color="default">
                            待签核
                        </Tag>
                        break;
                    case "C":
                        return <Tag icon={<MinusCircleOutlined />} color="default">
                            已取消
                            </Tag>
                        break;
                    default:
                        return <Tag icon={<ClockCircleOutlined />} color="default">
                            未知状态{record.actualSignStatus}
                        </Tag>
                        break;
                }
            }
        },
        {
            title: '签核意见',
            dataIndex: 'actualSignComment',
        }, {
            title: '签核时间',
            dataIndex: 'actualSignDateTime',
        }, {
            title: '操作',
            dataIndex: 'x',
            valueType: 'option',
            render: (_, record) => {
                return <a key="edit">退回到此步骤</a>;
            },
        },


    ]

    return (
        <>
            <ProCard style={{ marginTop: 8 }} bordered>
                <ProCard>
                    <ProCard colSpan={16}>
                        <ProCard>
                            <ProCard colSpan={12}>
                                {initialProps?.showApproveButton ?
                                    <Button
                                        key="approve"
                                        type="primary"
                                        onClick={async () => {
                                            if (props.onApprove?.validate) {
                                                const validateResult = await props.onApprove?.validate(initialProps.referenceId);
                                                if (!validateResult) {
                                                    message.error("页面校验不通过.无法签核");
                                                    return;
                                                }
                                            }
                                            let approveResult = await approve(referenceId, comment);
                                            if (approveResult.errorCode === 0) {
                                                props.onApprove?.success && props.onApprove?.success(approveResult.data?.list);
                                                message.success("签核成功");
                                                console.log(approveResult.data);
                                                setSignRecordDTOList(approveResult.data?.list as SignRecordDTO[]);
                                            } else {
                                                props.onApprove?.fail && props.onApprove?.fail(referenceId, approveResult.errorMessage);
                                                message.error(approveResult.errorMessage);
                                            }

                                        }}
                                        disabled={mode == "preview"}
                                    >
                                        {initialProps.approveButtonText}
                                    </Button>
                                    : null}
                            </ProCard>
                            <ProCard colSpan={12}>
                                {initialProps?.showRejectButton ?
                                    <Button key="reject" danger onClick={async () => {
                                        if (props.onReject?.validate) {
                                            const validateResult = await props.onReject?.validate(initialProps.referenceId);
                                            if (!validateResult) {
                                                message.error("页面校验不通过.无法签核");
                                                return;
                                            }
                                        }
                                        let rejectResult = await reject(referenceId, comment);
                                        if (rejectResult.errorCode === 0) {
                                            props.onReject?.success && props.onReject?.success(rejectResult.data?.list);
                                            message.success("駁回成功");
                                            console.log(rejectResult.data);
                                            setSignRecordDTOList(rejectResult.data?.list as SignRecordDTO[]);
                                        } else {
                                            props.onReject?.fail && props.onReject?.fail(referenceId, rejectResult.errorMessage);
                                            message.error(rejectResult.errorMessage);
                                        }
                                    }} disabled={mode == "preview"}>
                                        {initialProps.rejectButtonText}
                                    </Button>
                                    : null}
                            </ProCard>
                        </ProCard>
                        <ProCard>
                            <Input.TextArea title="签核意见" placeholder="签核意见" name="signContent" onChange={(e) => {
                                setComment(e.currentTarget.value);
                            }}></Input.TextArea>
                        </ProCard>
                    </ProCard>

                    <ProCard colSpan={8} title="Insights">

                    </ProCard>
                </ProCard>

            </ProCard>
            <ProCard colSpan={24}
                title={"单据号:" + referenceId}>
                <ProTable<SignRecordDTO>
                    columns={columns}
                    dataSource={signRecordDTOList}
                    rowKey="id"
                    toolBarRender={false}
                    search={false}
                    pagination={false}
                />
            </ProCard>
        </>
    );
};


export default OASignComponent;