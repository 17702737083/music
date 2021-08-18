import OASignComponent from "@/components/OA/OASign";
import ProCard from "@ant-design/pro-card";
import ProForm, { ProFormText, ProFormDependency, ProFormSelect } from "@ant-design/pro-form";
import { message, Form, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useModel } from "umi";



export default () => {

    const [dictKey, setDictKey] = useState("");
    const [referenceId, setReferenceId] = useState<string | undefined>("");
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const { initialState } = useModel('@@initialState');


    useEffect(() => {

        const tempReferenceId = initialState?.getQueryString("referenceId");
        //获取url参数。更新referenceId的值。123
        setReferenceId(tempReferenceId);
        setReadOnly(tempReferenceId ? true : false);
    }, []);

    return (
        <>

            <ProForm 
                
                onFinish={async (values) => {
                    console.log(values);
                    message.success('提交成功' + JSON.stringify(values));
                }}

                submitter={{
                    render: false
                }}

                
            >
                <ProCard>
                    <ProFormText
                        name="name"
                        label="姓名"
                        readonly={readOnly}
                    />
                    <ProFormText
                        name='age'
                        label="年龄"
                        readonly={readOnly}
                    />
                    <Button disabled={readOnly} onClick={() => {

                        setDictKey("sign.demo0429");

                    }} >产生签核流程</Button>
                </ProCard>

                <ProFormDependency name={["age", "name"]} >
                    {({ age, name }) => {
                        console.log("监测到表单的values", age, name);
                        return (
                            <OASignComponent
                                initialValues={{
                                    autoGenerateRefenceId: true,
                                    dictKey: dictKey,
                                    referenceId: referenceId,
                                    mode: "edit",
                                    callBackUrl:"/plant/basedata/tpcn",
                                    category:"测试大类",
                                    subCategory:"测试小类",
                                    item:"测试细项",
                                }}

                                onCreate={
                                    {
                                        success: async (data) => {
                                            console.log("流程产生成功", data);
                                        },
                                        fail: async (referenceId, message) => {

                                        }
                                    }
                                }

                                onApprove={
                                    {
                                        validate: async (referenceId) => {

                                            if (age && age > 18) {
                                                return true;
                                            } else {
                                                return false;
                                            }



                                        },
                                        success: async (data) => {
                                            console.log("签核成功", data);
                                        },
                                    }
                                }


                            >

                            </OASignComponent>
                        );
                    }}

                </ProFormDependency>


            </ProForm>
        </>);

};