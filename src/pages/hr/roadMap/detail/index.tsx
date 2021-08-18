import React, { useEffect, useState } from 'react';

import ProTable from '@ant-design/pro-table';
import styles from  './indes.less';
import './indes.less'
import {getfunctiondetail} from '../service'
import { DetailReq } from '../data';
import { CSVLink } from "react-csv";
import { Spin } from 'antd';

const Detail: React.FC<{}> = (props) => {

    const fuc=window.location.href.split('=')[1]

    const [date,setdate]=useState([])
    const [columns,setColumns]=useState([]);
    const [headers,setheaders]=useState([]);
    const [londing,setlonding]=useState(Boolean)
    useEffect(async()=>{

        setlonding(true)
        let list: any = {
            function:fuc,
        }
        const result=await getfunctiondetail(list as DetailReq);

        const column:any=[]
        const headers:any=[]
            
        result.cname.forEach((res,index)=>{

            let header={label:res,key:res}
            headers.push(header)

            let obj
            if(res=="课程"){
                 obj={title:res,dataIndex:res,align: 'center',
                    render:(context)=>[    
                    <p style={
                        {textAlign:context=='新人合格率'||context=='初阶合格率'||context=='中阶合格率'||   context=='高阶合格率'||context=='function合格率'?'center':'left',

                         color:context=='新人合格率'||context=='初阶合格率'||context=='中阶合格率'||   context=='高阶合格率'||context=='function合格率'?'#48ABAC':'white',

                         fontWeight:context=='新人合格率'||context=='初阶合格率'||context=='中阶合格率'||   context=='高阶合格率'||context=='function合格率'?'bold':'normal'}}>
                    {context}</p> 
                      ]}
            }else{
                obj={title:res,dataIndex:res,align: 'center',
                render:(context,index)=>[       
                    <p style={{textAlign:'center'}}><font color={context=='N'?'red':context=='NA'?'grey':'white'}>
                    {context}</font></p>
                       
                      ]}
            }
            column.push(obj);
        })
        setheaders(headers)
        setColumns(column);
        setdate(result.rookiecourse)
        setlonding(false)
    },[])

    return (
        <Spin spinning={londing}  tip={'加载中'}>      
        <ProTable
        headerTitle={fuc+"\xa0 \xa0Function RoadMap total达成明细"}
        size="small"
        className={styles.benchtable}
        pagination={false}
        columns={columns}
        dataSource={date}
        rowClassName={(record) => {
           if(record.课程==="新人合格率"||record.课程==="初阶合格率"||record.课程==="中阶合格率"||record.课程==="高阶合格率"||record.课程==="function合格率"){
            return 'table-color-dust';
           }else{
            return 'table-color-dus2';
           }
         }}
        search={false}
        scroll={{ x: 'max-content'}}
        toolBarRender={() => [
            <CSVLink data={date} headers={headers} enclosingCharacter={`'`}>
                Excel Download
            </CSVLink> 
          ]}
      /></Spin>
       
    );
}
export default Detail;