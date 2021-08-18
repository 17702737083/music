import React, { useState } from 'react';
import ProForm, { ProFormDependency, ProFormText } from '@ant-design/pro-form';

import ProCard from '@ant-design/pro-card';
import OASignComponent from '@/components/OA/OASign';
import { Button, message } from 'antd';
import { OASignInitialProps } from '@/components/OA/OASign/data';


export default () => {


    const [referenceId, setReferenceId] = useState("");
    const [dictKey, setDictKey] = useState("");
    const [mode, setMode] = useState<OASignInitialProps["mode"]>("edit");
    const [loading, setLoading] = useState(false);

    return (
        <>
            <ProCard>

                <ProForm<{
                    dictKey: string;
                    refNo: string;
                }>
                    submitter={
                        {
                            render: false
                        }
                    }

                >
                    <ProForm.Group>
                        <ProFormText width="md" name="dictKey" initialValue="truck.uploadTruckInfoSignFlow" label="流程dictKey" />
                        <ProFormDependency name={['dictKey']}>
                            {(values) => {
                                console.log("values", values);
                                return <Button loading={loading} type="primary" onClick={() => {
                                    setLoading(true);
                                    setMode("edit");
                                    setDictKey(values.dictKey);
                                }} >生成签核流程</Button>
                            }}
                        </ProFormDependency>
                    </ProForm.Group>
                    <ProForm.Group>
                        <ProFormText width="md" name="refNo" label="关联单号" />
                        <ProFormDependency name={['refNo']}>
                            {(values) => {
                                console.log("values", values);
                                return <Button loading={loading} type="primary" onClick={() => {
                                    setLoading(true);
                                    setMode("sign");
                                    setReferenceId(values.refNo);
                                }} >查询签核流程</Button>
                            }}
                        </ProFormDependency>
                    </ProForm.Group>
                </ProForm>
            </ProCard>

            <OASignComponent

                initialValues={{
                    dictKey: dictKey,
                    autoGenerateRefenceId: true,
                    referenceId: referenceId,
                    mode: mode,
                    callBackUrl:"/plant/basedata/tpcn",
                    category:"测试大类",
                    subCategory:"测试小类",
                    item:"TEST"
                }}

                onCreate={
                    {
                        success: async (res) => {
                            console.log("开单", res);
                            message.success("开单成功!");
                            setLoading(false);
                        },
                        fail: async (res) => {
                            setLoading(false);
                        }
                    }
                }

                onQuery={
                    {
                        success: async (res) => {
                            setLoading(false);
                            console.log("查询", res);
                            message.success("查询成功!");
                        },
                        fail: async (res) => {
                            setLoading(false);
                        }
                    }
                }

            />
        </>
    );
};