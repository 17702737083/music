import React, { useEffect,useState } from 'react';
import {  Col,  Descriptions,  message, Row, Tag } from 'antd';
import ProForm, { QueryFilter, ProFormText,   ProFormSelect, ModalForm } from '@ant-design/pro-form';
import styles from './index.less';
import { TableListItem } from '@/pages/hr/recruit/elc/ReNew/data';
import { dynamicquery  } from './service'; 
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { queryDictDetail } from '@/pages/system/basedata/Dict/service';
import {site,Dept} from './data'; 

type AdvancedSearchProps = {
  onFilterChange?: (allValues: any) => void;
  onSearch?: (text: string) => void;
  onTypeChange?: (type: string) => void;
  defaultType?: string;
};
 
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
  { title: '厂别', dataIndex: 'site', key: 'site', width: 70  },
  { title: '部门', dataIndex: 'dept', key: 'dept', width: 85 },
  { title: '工号', dataIndex: 'emplid', key: 'emplid', width: 105 },
  { title: '英文名', dataIndex: 'ename', key: 'ename', width: 90 },
  { title: '中文名', dataIndex: 'cname', key: 'cname', width: 50 },  
  {
    title: '技能卡',
    key: 'action',
    fixed: 'right',
    width: 80, 
    render: (_: any, record: Item) => { 
      return (
        <ModalForm 
        width={1000}
        trigger={<a>技能卡</a>}
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
  const [dataSource, setDataSource] = useState<TableListItem[]>([]);    
  const [site, setSite] = useState<site[]>([]);//厂别
  const [dept,setDept] = useState<Dept[]>([]);
  const [fact, setFact] = useState<string | undefined>();
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
  console.log("0000000000000000000000000000")
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

const { initialState } = useModel('@@initialState');
const achieveTime =()=> {
  var time = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate()
  return time
} 

  return (

    <>
      <Descriptions>
      <Descriptions.Item label="申请人">{initialState?.currentUser?.employeeInfoDTO?.cname}</Descriptions.Item>
      <Descriptions.Item label="申请人部门">{initialState?.currentUser?.employeeInfoDTO?.deptid}</Descriptions.Item>
      <Descriptions.Item label="申请日期"> {achieveTime()}</Descriptions.Item>
      <Descriptions.Item label="厂别">{}</Descriptions.Item>
      </Descriptions>
      
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
                  var backData = await dynamicquery(secondValues);
                  console.log("result:", backData);
                  setDataSource(backData); 
                  console.log(dataSource);
                  message.success('查询完毕');

                } }
              > 
 
                <Row gutter={[8, 2]}>
                  <Col span={8}>
                    <ProFormSelect
                      name="site"
                      label="Site" 
                      fieldProps={{onChange: (e) => { handleSiteChange(e); }, }} 
                      options={site} 
                      placeholder="Please select a Site"  />
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
                    <ProFormText label="Emplid" name="emplid" 
                     placeholder="Please select a Emplid" />
                  </Col>
                </Row>
              </ProForm>
            </QueryFilter>
          
        {/* -------------------------------------------------------------------------------------------------------- */}


        <ProTable
          dataSource={dataSource}
          columns={columns}
          search={false}
          pagination={{ pageSize: 10}} scroll={{ x: 200 }}
          bordered>

        </ProTable>
      
      
      </>
  );
};

export default AdvancedSearch;
 