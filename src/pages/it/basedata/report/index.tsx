import React, { useEffect,useState } from 'react';
import {  Card,  Col, Collapse, Descriptions,  message, Row, Tabs, Tag } from 'antd';
import { UpOutlined, DownOutlined,  BankFilled, PlayCircleTwoTone } from '@ant-design/icons';
import ProForm, { QueryFilter, ProFormText,  ProFormSelect, ProFormCheckbox, ModalForm } from '@ant-design/pro-form';
import styles from './index.less';
import { TableListItem } from '@/pages/hr/recruit/elc/ReNew/data';
import { dynamicquery,basecountdata } from './service';
import RcResizeObserver from 'rc-resize-observer';
import { StatisticCard } from '@ant-design/pro-card';
import {site,Dept} from './data';
import ProTable from '@ant-design/pro-table';
 
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';


const { TabPane } = Tabs;
// const { Column, ColumnGroup } = Table;
 
type AdvancedSearchProps = {
  onFilterChange?: (allValues: any) => void;
  onSearch?: (text: string) => void;
  onTypeChange?: (type: string) => void;
  defaultType?: string;
};

const { Panel } = Collapse;
  
const { Statistic, Divider } = StatisticCard;

const test01 = (duixiang)=>{
      let countWKS=0;
      let countWOK=0;
      let countWTZ=0;
      let countWMI=0;
      let countWMY =0;
      for(let j = 0; j < duixiang.length; j++) {
            if (duixiang[j].site == 'WKS') {
              countWKS++;
            }
            else if (duixiang[j].site == 'WOK') {
              countWOK++;
            }
            else if (duixiang[j].site == 'WTZ') {
              countWTZ++;
            }
            else if (duixiang[j].site == 'WMI') {
              countWMI++;
            }
            else if (duixiang[j].site == 'WMY') {
              countWMY++;
            }
             
      }
      let backArray = [countWKS,countWOK,countWTZ,countWMI,countWMY]; 
      return backArray;
}

const skillChange = (values)=>{  
  console.log("方法体内的values",values); 
  const skillOthers ={ scrumMaster:'',
                       techLead:'',
                       translator:'',
                       dataEngineer:'',
                       fullStackDeveloper:'',
                       developerFrontend:'',
                       developerBackend:'',
                       viriya:'',
                       master:'',
                       expert:''}
  for(let key  in values){
    console.log("方法内key",key) 
    if(values[key] == true && key in skillOthers ){
      values[key]= "Y"
    }else if (values[key] == true &&  skillOthers.hasOwnProperty(key)==false ){
      values[key]= "3"
    } 
    else if(values[key] == false){
      values[key]= null
    } 
  } 
  console.log("处理后的values",values) 
  return values;
} 

const choseColor = (value)=> { 
  if(value == 3){
    return "#87d068";
  }
}
       
// -----------------------------table栏位-----------------------------------------------------------------
 
const columns = [
  { title: '厂别', dataIndex: 'site', key: 'site', fixed: 'left', width: 70 },
  { title: '部门', dataIndex: 'dept', key: 'dept', fixed: 'left', width: 85 },
  { title: '工号', dataIndex: 'emplid', key: 'emplid', fixed: 'left', width: 105 },
  { title: '英文名', dataIndex: 'ename', key: 'ename', fixed: 'left', width: 90 },
  { title: '中文名', dataIndex: 'cname', key: 'cname', width: 50 }, 
  {       
    title: '應用系統',
    children: [
     { title : 'SFCS' ,dataIndex : 'sfcs'    ,key:'sfcs',   width: 80},
     { title : 'MES' ,dataIndex : 'mes'    ,key:'mes',   width: 80},
     { title : 'WMS' ,dataIndex : 'wms'    ,key:'wms',   width: 80},
     { title : 'LMS' ,dataIndex : 'lms'    ,key:'lms',   width: 80},
     { title : 'SAP' ,dataIndex : 'sap'    ,key:'sap',   width: 80},
     { title : 'eform' ,dataIndex : 'eform'    ,key:'eform',   width: 80},
     { title : 'CIEMS' ,dataIndex : 'ciems'    ,key:'ciems',   width: 80},
     { title : 'ICCS' ,dataIndex : 'iccs'    ,key:'iccs',   width: 80},
     { title : 'BYS' ,dataIndex : 'bys'    ,key:'bys',   width: 80},
     { title : 'New Sku' ,dataIndex : 'newsku'    ,key:'newsku',   width: 80},
     { title : 'EIP' ,dataIndex : 'eip'    ,key:'eip',   width: 80},
     { title : 'DCC' ,dataIndex : 'dcc'    ,key:'dcc',   width: 80},
     { title : 'War room' ,dataIndex : 'warRoom'    ,key:'warRoom',   width: 80},
     { title : 'TMS' ,dataIndex : 'tms'    ,key:'tms',   width: 80},
     { title : 'Myfa' ,dataIndex : 'myfa'    ,key:'myfa',   width: 80},
     { title : 'SQMS' ,dataIndex : 'sqms'    ,key:'sqms',   width: 80},
     { title : 'QC Audit' ,dataIndex : 'qcAudit'    ,key:'qcAudit',   width: 80},
     { title : 'QAMS' ,dataIndex : 'qams'    ,key:'qams',   width: 80},
     { title : 'ERS' ,dataIndex : 'ers'    ,key:'ers',   width: 80},
     { title : 'Cal' ,dataIndex : 'cal'    ,key:'cal',   width: 80},
     { title : 'impc' ,dataIndex : 'impc'    ,key:'impc',   width: 80},
     { title : 'Tiptop' ,dataIndex : 'tiptop'    ,key:'tiptop',   width: 80},
     { title : 'EHS' ,dataIndex : 'ehs'    ,key:'ehs',   width: 80},
     { title : 'epetition' ,dataIndex : 'epetition'    ,key:'epetition',   width: 80},
     { title : 'ICIO' ,dataIndex : 'icio'    ,key:'icio',   width: 80},
     { title : 'DL Training' ,dataIndex : 'dlTraining'    ,key:'dlTraining',   width: 80},
     { title : 'EMS' ,dataIndex : 'ems'    ,key:'ems',   width: 80},
     { title : 'FMS' ,dataIndex : 'fms'    ,key:'fms',   width: 80},
     { title : 'i4.0 Systems' ,dataIndex : 'i4Systems'    ,key:'i4Systems',   width: 80},
    ]
  },
  {
    title: 'IT基础建设',
    children: [
      { title :'Network' ,dataIndex :'network'    ,key:'network',   width: 80},
      { title :'Telephone' ,dataIndex :'telephone'    ,key:'telephone',   width: 80},
      { title :'Video conference' ,dataIndex :'videoConference'    ,key:'videoConference',   width: 80},
      { title :'Info Safety' ,dataIndex :'infoSafety'    ,key:'infoSafety',   width: 80},
      { title :'CCTV' ,dataIndex :'cctv'    ,key:'cctv',   width: 80},
      { title :'Swipe Card' ,dataIndex :'swipeCard'    ,key:'swipeCard',   width: 80},
      { title :'Anti-virus' ,dataIndex :'antivirus'    ,key:'antivirus',   width: 80},
      { title :'OA-Exchange' ,dataIndex :'oaexchange'    ,key:'oaexchange',   width: 80},
      { title :'OA-AD management' ,dataIndex :'oaadManagement'    ,key:'oaadManagement',   width: 80},
      { title :'OA-Software management' ,dataIndex :'oaSoftwareManagement'    ,key:'oaSoftwareManagement',   width: 80},
      { title :'SE-Server/Data base' ,dataIndex :'seServer'    ,key:'seServer',   width: 80}, 
    ]
  },
  {
    title: '數據收集/治理',
    children: [
      { title :'Nifi' ,dataIndex :'nifi' ,key :'nifi',   width: 80},         
      { title :'Kafka' ,dataIndex :'kafka' ,key :'kafka',   width: 80}, 
      { title :'MQTT' ,dataIndex :'mqtt' ,key :'mqtt',   width: 80}, 
      { title :'Logstash' ,dataIndex :'logstash' ,key :'logstash',   width: 80}, 
      { title :'Rabbit MQ' ,dataIndex :'rabbitMq' ,key :'rabbitMq',   width: 80}, 
      { title :'SDS' ,dataIndex :'sds' ,key :'sds',   width: 80}, 
      { title :'Power BI' ,dataIndex :'powerBi' ,key :'powerBi',   width: 80}, 
      { title :'WKC(IBM)' ,dataIndex :'wkc' ,key :'wkc',   width: 80}, 
      { title :'Airflow' ,dataIndex :'airflow' ,key :'airflow',   width: 80},
    ]
  },
  {
    title: '數據存儲',
    children: [
      { title :'ElasticSearch'  ,dataIndex :'elasticsearch'   ,key :'elasticsearch',   width: 80},
          { title :'Hadoop'  ,dataIndex :'hadoop'   ,key :'hadoop',   width: 80},
          { title :'Kudu'  ,dataIndex :'kudu'   ,key :'kudu',   width: 80},
          { title :'Redis'  ,dataIndex :'redis'   ,key :'redis',   width: 80},
          { title :'Maria DB'  ,dataIndex :'mariaDb'   ,key :'mariaDb',   width: 80},
          { title :'MySQL'  ,dataIndex :'mysql'   ,key :'mysql',   width: 80},
          { title :'SQLserver'  ,dataIndex :'sqlserver'   ,key :'sqlserver',   width: 80},
          { title :'Oracle'  ,dataIndex :'oracle'   ,key :'oracle',   width: 80},
          { title :'PostgreSQL'  ,dataIndex :'postgresql'   ,key :'postgresql',   width: 80},
    ]
  },
  {
    title: '系统開發',
    children: [
      { title :'ASP.NET'  ,dataIndex :'net'   ,key :'net',   width: 80},
      { title :'C++'  ,dataIndex :'cplus'   ,key :'cplus',   width: 80},
      { title :'C#'  ,dataIndex :'cplusPlus'   ,key :'cplusPlus ',   width: 80},
      { title :'Python'  ,dataIndex :'python'   ,key :'python',   width: 80},
      { title :'Java  '  ,dataIndex :'java'   ,key :'java',   width: 80},
      { title :'Javascripts'  ,dataIndex :'javascripts'   ,key :'javascripts',   width: 80},
      { title :'Angular '  ,dataIndex :'angular'   ,key :'angular',   width: 80},
      { title :'Loopback'  ,dataIndex :'loopback'   ,key :'loopback',   width: 80},
      { title :'React'  ,dataIndex :'react'   ,key :'react',   width: 80},
      { title :'Nodejs'  ,dataIndex :'nodejs'   ,key :'nodejs',   width: 80},
      { title :'Flink'  ,dataIndex :'flink'   ,key :'flink',   width: 80},
      { title :'VBA'  ,dataIndex :'vba'   ,key :'vba',   width: 80},
      { title :'R'  ,dataIndex :'r'   ,key :'r',   width: 80},
      { title :'TypeScripts'  ,dataIndex :'typescripts'   ,key :'typescripts',   width: 80},
      { title :'VUE'  ,dataIndex :'vue'   ,key :'vue',   width: 80}, 
    ]
  },
  {
    title: '移動開發',
    children: [
      { title :'IOS'  ,dataIndex:'ios'  ,key:'ios',   width: 80},
      { title :'Android'  ,dataIndex:'android'  ,key:'android',   width: 80},
      { title :'WeChat App'  ,dataIndex:'wechatApp'  ,key:'wechatApp',   width: 80},             
    ]
  },
  {
    title: '工具應用',
    children: [
      { title :'docker'  ,dataIndex:'docker'  ,key:'docker',   width: 80},
      { title :'k8s'  ,dataIndex:'k8s'  ,key:'k8s',   width: 80},
      { title :'gitlab'  ,dataIndex:'gitlab'  ,key:'gitlab',   width: 80},
      { title :'Rncher'  ,dataIndex:'rancher'  ,key:'rancher',   width: 80},
      { title :'Harbor'  ,dataIndex:'harbor'  ,key:'harbor',   width: 80},
      { title :'Kibana'  ,dataIndex:'kibana'  ,key:'kibana',   width: 80},
      { title :'Grafana'  ,dataIndex:'grafana'  ,key:'grafana',   width: 80},
      { title :'Nocas'  ,dataIndex:'nocas'  ,key:'nocas',   width: 80}, 
    ]
  },
  {
    title: 'RPA',
    children: [
      { title :'UiPath'  ,dataIndex:'uipath'  ,key:'uipath',   width: 80},
      { title :'AA OCR'  ,dataIndex:'aaOcr'  ,key:'aaOcr',   width: 80},
    ]
  },
  {
    title: '技能認證',
    children: [
      { title :'Scrum Master'  ,dataIndex:'scrumMaster'  ,key:'scrumMaster',   width: 80},
      { title :'Tech lead'  ,dataIndex:'techLead'  ,key:'techLead',   width: 80},
      { title :'Translator'  ,dataIndex:'translator'  ,key:'translator',   width: 80},
      { title :'Data Engineer'  ,dataIndex:'dataEngineer'  ,key:'dataEngineer',   width: 80},
      { title :'Full Stack Developer'  ,dataIndex:'fullStackDeveloper'  ,key:'fullStackDeveloper',   width: 80},
      { title :'Developer Frontend'  ,dataIndex:'developerFrontend'  ,key:'developerFrontend',   width: 80},
      { title :'Developer Backend'  ,dataIndex:'developerBackend'  ,key:'developerBackend',   width: 80},
      { title :'Viriya'  ,dataIndex:'viriya'  ,key:'viriya',   width: 80},
      { title :'Master'  ,dataIndex:'master'  ,key:'master',   width: 80},
      { title :'Expert'  ,dataIndex:'expert'  ,key:'expert',   width: 80},
    ]

  },
  {
    title: '技能卡',
    key: 'action',
    fixed: 'right',
    width: 80, 
    render: (_: any, record: Item) => { 
      return (
        <ModalForm 
        width={1000}
        trigger={<a>明细</a>}
        submitter={false} 
        > 
          <Descriptions size="small" column={5}>
            <Descriptions.Item label="英文名">{record.ename}</Descriptions.Item>
            <Descriptions.Item label="工号">{record.emplid}</Descriptions.Item>
            <Descriptions.Item label="厂别">{record.site}</Descriptions.Item>
            <Descriptions.Item label="部门">{record.dept}</Descriptions.Item> 
            <Descriptions.Item >
              {/* <Tag color="#2db7f5">一般</Tag>   */}
              <Tag color="#87d068">精通</Tag>
              <Tag color="#f50">认证</Tag> 
              </Descriptions.Item>  
          </Descriptions> 
          <Descriptions  size="small" column={2} bordered>
          <Descriptions.Item>應用系統</Descriptions.Item>
          <Descriptions.Item>
          <div>
          {record.sfcs>2?<Tag color={choseColor(record.sfcs)}>SFCS</Tag>: null}
          {record.mes>2?<Tag color={choseColor(record.mes)}>MES</Tag>: null}
          {record.wms>2?<Tag color={choseColor(record.wms)}>WMS</Tag>: null}
          {record.lms>2?<Tag color={choseColor(record.lms)}>LMS</Tag>: null}
          {record.sap>2?<Tag color={choseColor(record.sap)}>SAP</Tag>: null}
          {record.eform>2?<Tag color={choseColor(record.eform)}>eform</Tag>: null}
          {record.ciems>2?<Tag color={choseColor(record.ciems)}>CIEMS</Tag>: null}
          {record.iccs>2?<Tag color={choseColor(record.iccs)}>ICCS</Tag>: null}
          {record.bys>2?<Tag color={choseColor(record.bys)}>BYS</Tag>: null}
          {record.newsku>2?<Tag color={choseColor(record.newsku)}>New Sku</Tag>: null}
          {record.eip>2?<Tag color={choseColor(record.eip)}>EIP</Tag>: null}
          {record.dcc>2?<Tag color={choseColor(record.dcc)}>DCC</Tag>: null}
          {record.warRoom>2?<Tag color={choseColor(record.warRoom)}>War room</Tag>: null}
          {record.tms>2?<Tag color={choseColor(record.tms)}>TMS</Tag>: null}
          {record.myfa>2?<Tag color={choseColor(record.myfa)}>Myfa</Tag>: null}
          {record.sqms>2?<Tag color={choseColor(record.sqms)}>SQMS</Tag>: null}
          {record.qcAudit>2?<Tag color={choseColor(record.qcAudit)}>QC Audit</Tag>: null}
          {record.qams>2?<Tag color={choseColor(record.qams)}>QAMS</Tag>: null}
          {record.ers>2?<Tag color={choseColor(record.ers)}>ERS</Tag>: null}
          {record.cal>2?<Tag color={choseColor(record.cal)}>Cal</Tag>: null}
          {record.impc>2?<Tag color={choseColor(record.impc)}>impc</Tag>: null}
          {record.tiptop>2?<Tag color={choseColor(record.tiptop)}>Tiptop</Tag>: null}
          {record.ehs>2?<Tag color={choseColor(record.ehs)}>EHS</Tag>: null}
          {record.epetition>2?<Tag color={choseColor(record.epetition)}>epetition</Tag>: null}
          {record.icio>2?<Tag color={choseColor(record.icio)}>ICIO</Tag>: null}
          {record.dlTraining>2?<Tag color={choseColor(record.dlTraining)}>DL Training</Tag>: null}
          {record.ems>2?<Tag color={choseColor(record.ems)}>EMS</Tag>: null}
          {record.fms>2?<Tag color={choseColor(record.fms)}>FMS</Tag>: null}
          {record.i4Systems>2?<Tag color={choseColor(record.i4Systems)}>i4.0 Systems</Tag>: null} 
          </div>
          </Descriptions.Item>
          <Descriptions.Item>IT基础建设</Descriptions.Item>
          <Descriptions.Item> 
          <div>
          {record.network>2?<Tag color={choseColor(record.network)}>Network</Tag>: null}
          {record.telephone>2?<Tag color={choseColor(record.telephone)}>Telephone</Tag>: null}
          {record.videoConference>2?<Tag color={choseColor(record.videoConference)}>Video conference</Tag>: null}
          {record.infoSafety>2?<Tag color={choseColor(record.infoSafety)}>Info Safety</Tag>: null}
          {record.cctv>2?<Tag color={choseColor(record.cctv)}>CCTV</Tag>: null}
          {record.swipeCard>2?<Tag color={choseColor(record.swipeCard)}>Swipe Card</Tag>: null}
          {record.antivirus>2?<Tag color={choseColor(record.antivirus)}>Anti-virus</Tag>: null}
          {record.oaexchange>2?<Tag color={choseColor(record.oaexchange)}>OA-Exchange</Tag>: null}
          {record.oaadManagement>2?<Tag color={choseColor(record.oaadManagement)}>OA-AD management</Tag>: null}
          {record.oaSoftwareManagement>2?<Tag color={choseColor(record.oaSoftwareManagement)}>OA-Software management</Tag>: null}
          {record.seServer>2?<Tag color={choseColor(record.seServer)}>SE-Server/Data base</Tag>: null} 
          </div>
         </Descriptions.Item>
         <Descriptions.Item>數據收集/治理</Descriptions.Item>
         <Descriptions.Item>
          <div> 
          {record.nifi>2?<Tag color={choseColor(record.nifi)}>Nifi</Tag>: null}         
          {record.kafka>2?<Tag color={choseColor(record.kafka)}>Kafka</Tag>: null} 
          {record.mqtt>2?<Tag color={choseColor(record.mqtt)}>MQTT</Tag>: null} 
          {record.logstash>2?<Tag color={choseColor(record.logstash)}>Logstash</Tag>: null} 
          {record.rabbitMq>2?<Tag color={choseColor(record.rabbitMq)}>Rabbit MQ</Tag>: null} 
          {record.sds>2?<Tag color={choseColor(record.sds)}>SDS</Tag>: null} 
          {record.powerBi>2?<Tag color={choseColor(record.powerBi)}>Power BI</Tag>: null} 
          {record.wkc>2?<Tag color={choseColor(record.wkc)}>WKC(IBM)</Tag>: null} 
          {record.airflow>2?<Tag color={choseColor(record.airflow)}>Airflow</Tag>: null}
          </div>
         </Descriptions.Item>
         <Descriptions.Item>數據存儲</Descriptions.Item>
         <Descriptions.Item>
         <div>
          {record.elasticsearch>2?<Tag color={choseColor(record.elasticsearch)}>ElasticSearch</Tag>: null}
          {record.hadoop>2?<Tag color={choseColor(record.hadoop)}>Hadoop</Tag>: null}
          {record.kudu>2?<Tag color={choseColor(record.kudu)}>Kudu</Tag>: null}
          {record.redis>2?<Tag color={choseColor(record.redis)}>Redis</Tag>: null}
          {record.mariaDb>2?<Tag color={choseColor(record.mariaDb)}>Maria DB</Tag>: null}
          {record.mysql>2?<Tag color={choseColor(record.mysql)}>MySQL</Tag>: null}
          {record.sqlserver>2?<Tag color={choseColor(record.sqlserver)}>SQLserver</Tag>: null}
          {record.oracle>2?<Tag color={choseColor(record.oracle)}>Oracle</Tag>: null}
          {record.postgresql>2?<Tag color={choseColor(record.postgresql)}>PostgreSQL</Tag>: null}
          </div>
         </Descriptions.Item> 
         <Descriptions.Item>系统開發</Descriptions.Item>
         <Descriptions.Item>
           <div>
          {record.net>2?<Tag color={choseColor(record.net)}>ASP.NET</Tag>: null}
          {record.cplus>2?<Tag color={choseColor(record.cplus)}>C#</Tag>: null}
          {record.cplusPlus>2?<Tag color={choseColor(record.cplusPlus)}>C++</Tag>: null}
          {record.python>2?<Tag color={choseColor(record.python)}>Python</Tag>: null}
          {record.java>2?<Tag color={choseColor(record.java)}>Java</Tag>: null}
          {record.javascripts>2?<Tag color={choseColor(record.javascripts)}>Javascripts</Tag>: null}
          {record.angular>2?<Tag color={choseColor(record.angular)}>Angular</Tag>: null}
          {record.loopback>2?<Tag color={choseColor(record.loopback)}>Loopback</Tag>: null}
          {record.react>2?<Tag color={choseColor(record.react)}>React</Tag>: null}
          {record.nodejs>2?<Tag color={choseColor(record.nodejs)}>Nodejs</Tag>: null}
          {record.flink>2?<Tag color={choseColor(record.flink)}>Flink</Tag>: null}
          {record.vba>2?<Tag color={choseColor(record.vba)}>VBA</Tag>: null}
          {record.r>2?<Tag color={choseColor(record.r)}>R</Tag>: null}
          {record.typescripts>2?<Tag color={choseColor(record.typescripts)}>TypeScripts</Tag>: null}
          {record.vue>2?<Tag color={choseColor(record.vue)}>VUE</Tag>: null}
          </div>
         </Descriptions.Item>
         <Descriptions.Item>移動開發</Descriptions.Item>
         <Descriptions.Item>
          {record.ios>2?<Tag color={choseColor(record.ios)}>IOS</Tag>: null}
          {record.android>2?<Tag color={choseColor(record.android)}>Android</Tag>: null}
          {record.wechatApp>2?<Tag color={choseColor(record.wechatApp)}>WeChat App</Tag>: null}
         </Descriptions.Item>
         <Descriptions.Item>工具應用</Descriptions.Item>
         <Descriptions.Item>
         <div>
          {record.docker>2?<Tag color={choseColor(record.docker)}>docker</Tag>: null}
          {record.k8s>2?<Tag color={choseColor(record.k8s)}>k8s</Tag>: null}
          {record.gitlab>2?<Tag color={choseColor(record.gitlab)}>gitlab</Tag>: null}
          {record.rancher>2?<Tag color={choseColor(record.rancher)}>Rncher</Tag>: null}
          {record.harbor>2?<Tag color={choseColor(record.harbor)}>Harbor</Tag>: null}
          {record.kibana>2?<Tag color={choseColor(record.kibana)}>Kibana</Tag>: null}
          {record.grafana>2?<Tag color={choseColor(record.grafana)}>Grafana</Tag>: null}
          {record.nocas>2?<Tag color={choseColor(record.nocas)}>Nocas</Tag>: null}
          </div> 
         </Descriptions.Item>
         <Descriptions.Item>RPA</Descriptions.Item>
         <Descriptions.Item>
          {record.uipath>2?<Tag color={choseColor(record.uipath)}>UiPath</Tag>: null}
          {record.aaOcr>2?<Tag color={choseColor(record.aaOcr)}>AA OCR</Tag>: null}
         </Descriptions.Item>
         <Descriptions.Item>技能認證</Descriptions.Item>
         <Descriptions.Item>
         <div>
          {record.scrumMaster=="Y"?<Tag color="#f50">.Scrum Master</Tag>: null}
          {record.techLead=="Y"?<Tag color="#f50">Tech lead</Tag>: null}
          {record.translator=="Y"?<Tag color="#f50">Translator</Tag>: null}
          {record.dataEngineer=="Y"?<Tag color="#f50">Data Engineer</Tag>: null}
          {record.fullStackDeveloper=="Y"?<Tag color="#f50">Full Stack Developer</Tag>: null}
          {record.developerFrontend=="Y"?<Tag color="#f50">Developer Frontend</Tag>: null}
          {record.developerBackend=="Y"?<Tag color="#f50">Developer Backend</Tag>: null}
          {record.viriya=="Y"?<Tag color="#f50">Viriya</Tag>: null}
          {record.master=="Y"?<Tag color="#f50">Master</Tag>: null}
          {record.expert=="Y"?<Tag color="#f50">Expert</Tag>: null}</div>
         </Descriptions.Item>
         </Descriptions>
      </ModalForm>
      );
    },
  },
]
 
// ----------------------------------------------------------------------------------------------


const AdvancedSearch: React.FC<AdvancedSearchProps> = (props) => {
  const { onSearch, onTypeChange, defaultType = 'articles', onFilterChange } = props; 
  const [showFilter, setShowFilter] = useState<boolean>(true);  
  const [dataSource, setDataSource] = useState<TableListItem[]>([]); 
  const [responsive, setResponsive] = useState(false);

  const [totalHeadcount,setTotalHeadcount]= useState(0);
  const [selectHeadCount,setSelectHeadCount]= useState(0);
  const [wksHeadCount,setWksHeadCount]= useState(0);
  const [wokHeadCount,setWokHeadCount]= useState(0);
  const [wtzHeadCount,setWtzHeadCount]= useState(0);
  const [wmiHeadCount,setWmiHeadCount]= useState(0);
  const [wmyHeadCount,setWmyHeadCount]= useState(0); 

  const [site, setSite] = useState<site[]>([]);//厂别
  const [dept,setDept] = useState<Dept[]>([]);//部门
  const [fact, setFact] = useState<string | undefined>();//默认部门选项
  //调用初始化查询
const fetchRemoteData = async (params) => {
  return await queryDictDetail(params);
  };
//获取site
const getsite = async () => {
  const data: any = await fetchRemoteData("it.skill.siteCode");
  const dictList = data.data.list;
  let sitelist: site[] = [];
  dictList.filter(item => item.dictValueSort !== 0)
    .forEach(item => {
        const valueObj = JSON.parse(item.dictValue as string);
        let siteObj: site = {};
        siteObj = valueObj.site;
        sitelist.push(siteObj);
    })
    setSite(sitelist);
}

const getdept = async () => {
  const data: any = await fetchRemoteData("it.skill.deptCode");
  const dictList = data.data.list;
  let deptlist: dept[] = [];
  dictList.filter(item => item.dictValueSort !== 0)
    .forEach(item => {
        const valueObj = JSON.parse(item.dictValue as string);
        let deptObj: dept = {};
        deptObj = valueObj.dept;
        deptlist.push(deptObj);
    })
    setDept(deptlist);
}

useEffect(async () => {  
  getsite();   
  getdept();  
}, []);
 

//site值变化，需要自动变更dept的值
const handleSiteChange =  async(e) => { 
  setFact(null);      
  if (e == undefined){
    getdept();
  }
  else {const data: any = await fetchRemoteData("it.skill.deptCode");
  console.log("当前选择的data",data)
  const dictList = data.data.list;
  let deptlist: Dept[] = []; 
  dictList.filter((item: { dictValueSort: number; dictValue: string; }) => item.dictValueSort !== 0 && JSON.parse(item.dictValue).site == e).forEach(item => {
        const valueObj = JSON.parse(item.dictValue as string);
        let deptObj: Dept = {};
        deptObj = valueObj.dept;
        deptlist.push(deptObj);
    })
  setDept(deptlist);} 
} 
  
  return (
    <Card
      bodyStyle={{ paddingBottom: 0 }}
      bordered={false}
      className={showFilter ? '' : styles.hiddenFilter}
    >  
      
      <Tabs  defaultActiveKey="1" centered
        onChange={onTypeChange}
        tabBarExtraContent={
          <a
            className={styles.filterTrigger}
            onClick={() => {
              setShowFilter(!showFilter);
            }}
          >
            条件查询 {showFilter ? <UpOutlined /> : <DownOutlined />}
          </a>
        }
        > 
        <TabPane tab= {
                        <span> 
                            <BankFilled /> IT人员技能系统 
                        </span>
                      } key="1" > 
                       <QueryFilter
        submitter={false}
        span={24}
        labelWidth="auto"
        split
        onChange={onFilterChange}
        className={styles.filter}
        >
        <ProForm
            submitter={{
              // 配置按钮文本
              searchConfig: {
                resetText: '重置',
                submitText: '查询',
              },
            }}
            onFinish={async (values) => {   
              console.log(values);  
              const secondValues = skillChange(values);    
              var totalcount =await basecountdata(secondValues);
              setTotalHeadcount(totalcount.length);
              var backData =await dynamicquery(secondValues); 
              console.log("result:",backData)
              let fenZu = test01(backData);
              setWksHeadCount(fenZu[0]);
              setWokHeadCount(fenZu[1]);
              setWtzHeadCount(fenZu[2]);
              setWmiHeadCount(fenZu[3]);
              setWmyHeadCount(fenZu[4]);
              setDataSource (backData);
              setSelectHeadCount(backData.length) 
              console.log(dataSource); 
              message.success('查询完毕');  
              
            }}
      >  
      <Row gutter={[8, 2]}>  
        <Col span={8}>     
      <ProFormSelect
          name="site"
          label="Site" 
          options={site} 
          fieldProps={{//这里使用了select的onChange方法，必须使用这样的写法来进行调用onChange方法
          onChange:(value)=>{handleSiteChange(value)},
        }}
 
          placeholder="Please select a Site"
          rules={[{  message: 'Please select your Site!' }]}
        />
        </Col>
        <Col span={8}>     
      <ProFormSelect
          name="dept"
          label="Dept" 
          options={dept} 
          fieldProps={{ value: fact,onChange: (e) => {setFact(e)}}} 
          placeholder="Please select a Dept" 
        />
        </Col>
        <Col span={8}>
        <ProFormText label="Emplid" name="emplid"   placeholder="Please select a Emplid" />
        </Col>
        </Row> 
        <Collapse  
              expandIcon={({ isActive }) => <PlayCircleTwoTone   rotate={isActive ? 90 : 0} />}>
              <Panel header= "1.應用系統(Application System)" key="1" > 
              <Collapse>
              <Panel header="MFG&Logistic" key="1">
              <p>
                <Row gutter={[8, 2]}>  
                    <Col span={4}>  
                    <ProFormCheckbox name="sap"  >SAP</ProFormCheckbox> 
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="newsku" >NewSku</ProFormCheckbox>
                    </Col> 
                    <Col span={4}>             
                    <ProFormCheckbox name = "sfcs" > SFCS </ProFormCheckbox>
                     </Col> 
                     <Col span={4}>             
                    <ProFormCheckbox name="mes" >MES </ProFormCheckbox>  
                     </Col>
                     <Col span={4}>       
                     <ProFormCheckbox  name="wms" >WMS</ProFormCheckbox> 
                    </Col>
                    <Col span={4}>             
                    <ProFormCheckbox name="lms"  >LMS</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox >CIEMS</ProFormCheckbox>
                    </Col>
                    <Col span={4}>             
                    <ProFormCheckbox name="iccs">ICCS</ProFormCheckbox> 
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="qcAudit" >QC Audit</ProFormCheckbox>
                    </Col>  
                    <Col span={4}> 
                    <ProFormCheckbox name="sqms" >SQMS</ProFormCheckbox>
                    </Col>
                     
                   </Row>  
                    </p>
              </Panel>
              <Panel header="HR&Admin" key="2">
              <p>
              <Row gutter={[8, 2]}>    
                    <Col span={4}> 
                    <ProFormCheckbox name="eform" >E-form</ProFormCheckbox>
                    </Col>  
                     <Col span={4}>             
                    <ProFormCheckbox name="bys" >BYS</ProFormCheckbox> 
                     </Col>  
                    <Col span={4}> 
                    <ProFormCheckbox name="eip" >EIP</ProFormCheckbox> 
                    </Col>
                    <Col span={4}>             
                    <ProFormCheckbox name="dcc" >DCC</ProFormCheckbox> 
                     </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="warRoom" >War room</ProFormCheckbox> 
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="tms" >TMS</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="myfa" >Myfa</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="qams" >QAMS</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="ers" >ERS</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="cal" >Cal</ProFormCheckbox>
                    </Col>  
                    <Col span={4}> 
                    <ProFormCheckbox name="impc" >IMPC</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="tiptop" >TIPTOP</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="ehs" >EHS</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="epetition" >ePetition</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="icio" >ICIO</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="dlTraining" >DL_Training</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="ems" >EMS</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="fms" >FMS</ProFormCheckbox>
                    </Col>  
                    </Row>
              </p>
              </Panel>
              <Panel header="i4.0" key="3">
              <p>
                <ProFormCheckbox name="i4Systems" >i4.0 Systems</ProFormCheckbox>
              </p>
              </Panel>
              </Collapse> 
       
        </Panel>
              <Panel header="2.IT基礎建設(Infrastructure)" key="2">
      <p>
       <Row gutter={[8, 2]}>  
                    <Col span={4}> 
                    <ProFormCheckbox name="network" >Network</ProFormCheckbox>
                    </Col>
                    <Col span={4}>             
                    <ProFormCheckbox name="telephone" >Telephone</ProFormCheckbox> 
                     </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="videoConference" >Video conference</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="infoSafety" >Info Safety</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="cctv" >CCTV</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="swipeCard" >Swipe Card</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="antivirus" >Anti-virus</ProFormCheckbox>
                    </Col>    
                    <Col span={4}> 
                    <ProFormCheckbox name="oaexchange" >OA-Exchange</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="oaadManagement" >OA-AD management</ProFormCheckbox>
                     </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="seServer" >SE-Server/Data base</ProFormCheckbox>
                    </Col>
                    </Row>
      </p>
      </Panel>
              <Panel header="3.數據收集/治理(Data collection)" key="3">
      <p>
       <Row gutter={[8, 2]}> 
                    <Col span={4}> 
                    <ProFormCheckbox name="nifi" >Nifi</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="kafka" >Kafka</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="mqtt" >MQTT</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="logstash" >Logstash</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="rabbitMq" >Rabbit MQ</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="sds" >SDS</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="powerBi" >Power BI</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="wkc" >WKC(IBM)</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="airflow" >Airflow</ProFormCheckbox>
                    </Col>
                    </Row>
      </p>
      </Panel>
              <Panel header="4.數據存儲(Data Storage)" key="4">
      <p>
               <Row gutter={[8, 2]}>  
                    <Col span={4}> 
                    <ProFormCheckbox name="elasticsearch" >ElasticSearch</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="hadoop" >Hadoop</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="kudu" >Kudu</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="redis" >Redis</ProFormCheckbox>

                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="mariaDb" >Maria DB</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="mysql" >MySQL</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="sqlserver" >SQLserver</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="oracle" >Oracle</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="postgresql" >PostgreSQL</ProFormCheckbox> 
                    </Col>
                    </Row>
                    </p>
    </Panel> 
              <Panel header="5.系统開發(System Development)" key="5">
      <p>
       <Row gutter={[8, 2]}>  
                    <Col span={4}> 
                    <ProFormCheckbox name="net" >ASP.NET</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="cplus" >C#</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="cplusPlus" >C++</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="python" >Python</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="java" > Java</ProFormCheckbox>
                    
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox 
                    name="javascripts" >Javascripts</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="angular" >Angular</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="loopback" >Loopback</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="react" >React</ProFormCheckbox>
                    
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="nodejs" >Nodejs</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="flink" >Flink</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="vba" >VBA</ProFormCheckbox> 
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="r" >R</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="typescripts" >TypeScripts</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="vue" >VUE</ProFormCheckbox> 
                    </Col>
                    </Row>
                    </p>
    </Panel>
              <Panel header="6.移動開發(Mobile Development)" key="6">
              <p> <Row gutter={[8, 2]}>  
                    <Col span={4}> 
                    <ProFormCheckbox name="ios" >IOS</ProFormCheckbox>

                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="android" >Android</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="wechatApp" >WeChat App</ProFormCheckbox>
                     </Col>  
                    </Row>
                    </p>
    </Panel>
              <Panel header="7.工具應用(Tool Using)" key="7">
      <p>
    <Row gutter={[8, 2]}>   
                    <Col span={4}> 
                    <ProFormCheckbox name="docker" >Docker</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="k8s" >k8s</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="gitlab" >GitLab</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="rancher" >Rancher</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="harbor" >Harbor</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="kibana" >Kibana</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="grafana" >Grafana</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="nocas" >Nocas</ProFormCheckbox>
                    </Col>
                    </Row>
      </p>
      </Panel>
              <Panel header="8.RPA" key="8">
      <p> 
       <Row gutter={[8, 2]}> 
                    <Col span={4}> 
                    <ProFormCheckbox name="uipath" >UiPath</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="aaOcr" >AA OCR</ProFormCheckbox>
                    </Col>
                    </Row>
      </p>
      </Panel>
              <Panel header="9.技能認證(Certification)" key="9">
      <p> 
       <Row gutter={[8, 2]}> 
                    <Col span={4}> 
                    <ProFormCheckbox name="scrumMaster">Scrum Master</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="techLead">Tech Lead</ProFormCheckbox>
                    </Col>  
                    <Col span={4}> 
                    <ProFormCheckbox name="translator">Translator</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="dataEngineer">Data Engineer</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="fullStackDeveloper">Full Stack Developer</ProFormCheckbox>
                    </Col> 
                    <Col span={4}> 
                    <ProFormCheckbox name="developerFrontend">Developer Frontend</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="developerBackend">Developer Backend</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="viriya">Viriya</ProFormCheckbox>
                    </Col>
                    <Col span={4}> 
                    <ProFormCheckbox name="master">Master</ProFormCheckbox>
                    </Col>
                    <Col span={4}>  
                    <ProFormCheckbox name="expert">Expert</ProFormCheckbox>
                    </Col>
                    </Row>
      </p>
      </Panel>
              </Collapse>
              </ProForm>
        </QueryFilter> 
        </TabPane> 
         
      </Tabs>
{/* -------------------------------------------------------------------------------------------------------- */}
<RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          statistic={{
            title: 'IT总人数',
            value: totalHeadcount,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '符合条件人数',
            value: selectHeadCount,
            description: <Statistic title="占比" value={Math.round((selectHeadCount/totalHeadcount)*10000)/100+'%'} />,
          }} 
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: 'WKS人数',
            value: wksHeadCount,
            description: <Statistic title="占比" value={Math.round((wksHeadCount/totalHeadcount)*10000)/100+'%'} />,
          }} 
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: 'WOK人数',
            value: wokHeadCount,
            description: <Statistic title="占比" value={Math.round((wokHeadCount/totalHeadcount)*10000)/100+'%'} />,
          }} 
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: 'WTZ人数',
            value: wtzHeadCount,
            description: <Statistic title="占比" value={Math.round((wtzHeadCount/totalHeadcount)*10000)/100+'%'} />,
          }} 
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: 'WMI人数',
            value: wmiHeadCount,
            description: <Statistic title="占比" value={Math.round((wmiHeadCount/totalHeadcount)*10000)/100+'%'} />,
          }} 
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: 'WMY人数',
            value: wmyHeadCount,
            description: <Statistic title="占比" value={Math.round((wmyHeadCount/totalHeadcount)*10000)/100+'%'}/>,
          }} 
          chartPlacement="left"
        />
      </StatisticCard.Group>
    </RcResizeObserver>
 
      <ProTable   
      dataSource={dataSource}  
      columns={columns}  
      search={false}
      pagination={{ pageSize: 4 }} scroll={{ x: 200 }}
      bordered >
        {/* <ColumnGroup title="基础信息">  
        <Column     title= '厂别'    dataIndex= 'site'    key= 'site'  />
        <Column     title= '部门'    dataIndex= 'dept'    key= 'dept'  />
        <Column     title= '工号'    dataIndex= 'emplid'    key= 'emplid'  />
        <Column     title= '英文名'  dataIndex= 'ename'    key= 'ename'  /> 
        <Column     title= '中文名'  dataIndex= 'cname'  key= 'cname'/> 
        </ColumnGroup>
        <ColumnGroup title="應用系統">
          <Column title = 'SFCS' dataIndex = 'sfcs'    key='sfcs'/>
          <Column title = 'MES' dataIndex = 'mes'    key='mes'/>
          <Column title = 'WMS' dataIndex = 'wms'    key='wms'/>
          <Column title = 'LMS' dataIndex = 'lms'    key='lms'/>
          <Column title = 'SAP' dataIndex = 'sap'    key='sap'/>
          <Column title = 'eform' dataIndex = 'eform'    key='eform'/>
          <Column title = 'CIEMS' dataIndex = 'ciems'    key='ciems'/>
          <Column title = 'ICCS' dataIndex = 'iccs'    key='iccs'/>
          <Column title = 'BYS' dataIndex = 'bys'    key='bys'/>
          <Column title = 'New Sku' dataIndex = 'newsku'    key='newsku'/>
          <Column title = 'EIP' dataIndex = 'eip'    key='eip'/>
          <Column title = 'DCC' dataIndex = 'dcc'    key='dcc'/>
          <Column title = 'War room' dataIndex = 'warRoom'    key='warRoom'/>
          <Column title = 'TMS' dataIndex = 'tms'    key='tms'/>
          <Column title = 'Myfa' dataIndex = 'myfa'    key='myfa'/>
          <Column title = 'SQMS' dataIndex = 'sqms'    key='sqms'/>
          <Column title = 'QC Audit' dataIndex = 'qcAudit'    key='qcAudit'/>
          <Column title = 'QAMS' dataIndex = 'qams'    key='qams'/>
          <Column title = 'ERS' dataIndex = 'ers'    key='ers'/>
          <Column title = 'Cal' dataIndex = 'cal'    key='cal'/>
          <Column title = 'impc' dataIndex = 'impc'    key='impc'/>
          <Column title = 'Tiptop' dataIndex = 'tiptop'    key='tiptop'/>
          <Column title = 'EHS' dataIndex = 'ehs'    key='ehs'/>
          <Column title = 'epetition' dataIndex = 'epetition'    key='epetition'/>
          <Column title = 'ICIO' dataIndex = 'icio'    key='icio'/>
          <Column title = 'DL Training' dataIndex = 'dlTraining'    key='dlTraining'/>
          <Column title = 'EMS' dataIndex = 'ems'    key='ems'/>
          <Column title = 'FMS' dataIndex = 'fms'    key='fms'/>
          <Column title = 'i4.0 Systems' dataIndex = 'i4Systems'    key='i4Systems'/>
        </ColumnGroup>
        <ColumnGroup title="IT基础建设">
          <Column title = 'Network' dataIndex = 'network'    key='network'/>
          <Column title = 'Telephone' dataIndex = 'telephone'    key='telephone'/>
          <Column title = 'Video conference' dataIndex = 'videoConference'    key='videoConference'/>
          <Column title = 'Info Safety' dataIndex = 'infoSafety'    key='infoSafety'/>
          <Column title = 'CCTV' dataIndex = 'cctv'    key='cctv'/>
          <Column title = 'Swipe Card' dataIndex = 'swipeCard'    key='swipeCard'/>
          <Column title = 'Anti-virus' dataIndex = 'antivirus'    key='antivirus'/>
          <Column title = 'OA-Exchange' dataIndex = 'oaexchange'    key='oaexchange'/>
          <Column title = 'OA-AD management' dataIndex = 'oaadManagement'    key='oaadManagement'/>
          <Column title = 'OA-Software management' dataIndex = 'oaSoftwareManagement'    key='oaSoftwareManagement'/>
          <Column title = 'SE-Server/Data base' dataIndex = 'seServer'    key='seServer'/> 
        </ColumnGroup>
        <ColumnGroup title="數據收集/治理"> 
          <Column title = 'Nifi' dataIndex = 'nifi' key ='nifi'/>         
          <Column title = 'Kafka' dataIndex = 'kafka' key ='kafka'/> 
          <Column title = 'MQTT' dataIndex = 'mqtt' key ='mqtt'/> 
          <Column title = 'Logstash' dataIndex = 'logstash' key ='logstash'/> 
          <Column title = 'Rabbit MQ' dataIndex = 'rabbitMq' key ='rabbitMq'/> 
          <Column title = 'SDS' dataIndex = 'sds' key ='sds'/> 
          <Column title = 'Power BI' dataIndex = 'powerBi' key ='powerBi'/> 
          <Column title = 'WKC(IBM)' dataIndex = 'wkc' key ='wkc'/> 
          <Column title = 'Airflow' dataIndex = 'airflow' key ='airflow'/>
        </ColumnGroup>
        <ColumnGroup title="數據存儲"> 
          <Column title = 'ElasticSearch'  dataIndex = 'elasticsearch'   key ='elasticsearch'/>
          <Column title = 'Hadoop'  dataIndex = 'hadoop'   key ='hadoop'/>
          <Column title = 'Kudu'  dataIndex = 'kudu'   key ='kudu'/>
          <Column title = 'Redis'  dataIndex = 'redis'   key ='redis'/>
          <Column title = 'Maria DB'  dataIndex = 'mariaDb'   key ='mariaDb'/>
          <Column title = 'MySQL'  dataIndex = 'mysql'   key ='mysql'/>
          <Column title = 'SQLserver'  dataIndex = 'sqlserver'   key ='sqlserver'/>
          <Column title = 'Oracle'  dataIndex = 'oracle'   key ='oracle'/>
          <Column title = 'PostgreSQL'  dataIndex = 'postgresql'   key ='postgresql'/>
        </ColumnGroup>
        <ColumnGroup title="系统開發">
          <Column title = 'ASP.NET'  dataIndex = 'net'   key ='net'/>
          <Column title = 'C++'  dataIndex = 'cplus'   key ='cplus'/>
          <Column title = 'C#'  dataIndex = 'cplusPlus'   key ='cplusPlus '/>
          <Column title = 'Python'  dataIndex = 'python'   key ='python'/>
          <Column title = 'Java  '  dataIndex = 'java'   key ='java'/>
          <Column title = 'Javascripts'  dataIndex = 'javascripts'   key ='javascripts'/>
          <Column title = 'Angular '  dataIndex = 'angular'   key ='angular'/>
          <Column title = 'Loopback'  dataIndex = 'loopback'   key ='loopback'/>
          <Column title = 'React'  dataIndex = 'react'   key ='react'/>
          <Column title = 'Nodejs'  dataIndex = 'nodejs'   key ='nodejs'/>
          <Column title = 'Flink'  dataIndex = 'flink'   key ='flink'/>
          <Column title = 'VBA'  dataIndex = 'vba'   key ='vba'/>
          <Column title = 'R'  dataIndex = 'r'   key ='r'/>
          <Column title = 'TypeScripts'  dataIndex = 'typescripts'   key ='typescripts'/>
          <Column title = 'VUE'  dataIndex = 'vue'   key ='vue'/> 
        </ColumnGroup>
        <ColumnGroup title="移動開發"> 
          <Column title = 'IOS'  dataIndex= 'ios'  key= 'ios'/>
          <Column title = 'Android'  dataIndex= 'android'  key= 'android'/>
          <Column title = 'WeChat App'  dataIndex= 'wechatApp'  key= 'wechatApp'/>             
        </ColumnGroup>
        <ColumnGroup title="工具應用">
        <Column title = 'docker'  dataIndex= 'docker'  key= 'docker'/>
        <Column title = 'k8s'  dataIndex= 'k8s'  key= 'k8s'/>
        <Column title = 'gitlab'  dataIndex= 'gitlab'  key= 'gitlab'/>
        <Column title = 'Rncher'  dataIndex= 'rancher'  key= 'rancher'/>
        <Column title = 'Harbor'  dataIndex= 'harbor'  key= 'harbor'/>
        <Column title = 'Kibana'  dataIndex= 'kibana'  key= 'kibana'/>
        <Column title = 'Grafana'  dataIndex= 'grafana'  key= 'grafana'/>
        <Column title = 'Nocas'  dataIndex= 'nocas'  key= 'nocas'/> 
        </ColumnGroup>
        <ColumnGroup title="RPA"> 
          <Column title = 'UiPath'  dataIndex= 'uipath'  key= 'uipath'/>
          <Column title = 'AA OCR'  dataIndex= 'aaOcr'  key= 'aaOcr'/>
        </ColumnGroup>
        <ColumnGroup title="技能認證"> 
          <Column title = 'Scrum Master'  dataIndex= 'scrumMaster'  key= 'scrumMaster'/>
          <Column title = 'Tech lead'  dataIndex= 'techLead'  key= 'techLead'/>
          <Column title = 'Translator'  dataIndex= 'translator'  key= 'translator'/>
          <Column title = 'Data Engineer'  dataIndex= 'dataEngineer'  key= 'dataEngineer'/>
          <Column title = 'Full Stack Developer'  dataIndex= 'fullStackDeveloper'  key= 'fullStackDeveloper'/>
          <Column title = 'Developer Frontend'  dataIndex= 'developerFrontend'  key= 'developerFrontend'/>
          <Column title = 'Developer Backend'  dataIndex= 'developerBackend'  key= 'developerBackend'/>
          <Column title = 'Viriya'  dataIndex= 'viriya'  key= 'viriya'/>
          <Column title = 'Master'  dataIndex= 'master'  key= 'master'/>
          <Column title = 'Expert'  dataIndex= 'expert'  key= 'expert'/>
        </ColumnGroup>  */}
      </ProTable>
    </Card>
  );
};

export default AdvancedSearch;