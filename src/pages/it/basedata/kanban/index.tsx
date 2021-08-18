import React, { useState } from 'react'; 
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data';
import { dynamicquery } from './service';     
import moment from 'moment'; 
// import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
// import { PageContainer } from '@ant-design/pro-layout'; 

//import   './kanban.less';
import { reduce } from 'lodash';
 
const ITKanbanReport: React.FC = () => {  

  const [time, setTime] = useState(() => Date.now());
  
  const [polling] = useState<number | undefined>(2000);

  const timeAwait = (waitTime: number): Promise<void> =>

  new Promise((res) =>
    window.setTimeout(() => {
      res();
    }, waitTime),
  ); 

  const columns: ProColumns<TableListItem>[] = [
 
    {
      title: 'Site',
      dataIndex: 'site',
      width: 80,
      align: 'center'
    },
    {
      title: 'Dept',
      dataIndex: 'dept',
      width: 80,
      align: 'center'
    },
    {
      title: '计划人力(Leader)',
      dataIndex: 'leaderplan',
      width: 80,
      align: 'center'
    },
    {
      title: '实际人力(Leader)',
      dataIndex: 'leaderowner',
      width: 80,
      align: 'center'
    },
    {
      title: '计划人力(Engineer)',
      dataIndex: 'engineerplan',
      width: 80,
      align: 'center'
    },
    {
      title: '实际人力(Engineer)',
      dataIndex: 'engineerowner',
      width: 80,
      align: 'center'

    },
    {
      title: '待离职',
      dataIndex: 'planresign',
      width: 80,
      align: 'center' 
    },
    {
      title: '待报到',
      dataIndex: 'planregister',
      width: 80,
      align: 'center'
    },
    {
      title: '待招聘',
      dataIndex: 'planresuit',
      width: 80,
      align: 'center',
      render: (text, record) => {
        return (
          (record.engineerplan+record.leaderplan-record.engineerowner-record.leaderowner
            -record.planregister+record.planresign)/(record.engineerplan+record.leaderplan)> 0.1?
            (
              <span style={{color:'red'}}>{text}</span>
            ) : <span>{text}</span>
        );
  
      }
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      width: 80,
      align: 'center'
    },
  ];
   

  return (     
      <ProTable     
        columns={columns} 
        polling={polling || undefined} 
        
        //  request=
        // {
        //   async () => {
        //   await timeAwait(2000);
        //   setTime(Date.now()); 
        //   debugger
        //   console.log(11111 1111)
        //   return {
            
        //       params: dynamicquery({ params}),
        //       success: true,
        //       total:columns.length,
        //    }; 
        // }}  
        request={(params, sorter, filter) => dynamicquery({ params, sorter, filter })}
        size="middle"//table的密度设置为中等
        options={{ 
            fullScreen: true,
            // search: false,
            density:false,//是否显示密度框
            // density?: true,
            // reload:true, 
            setting: false,
           
        }}  
        search={false}  
        bordered={true} 
        headerTitle={`IT人力看板`} //${moment(time).format('HH:mm:ss')}
        pagination={{  
            // 分页 
            size :"small",
            //simple: true, 
            defaultPageSize: 9,
            showQuickJumper:true,  
          // current: this.state.current,
          // total: this.state.total2,
          // onChange: this.changePage,
        }} 
      /> 
  );
};

export default ITKanbanReport; 
