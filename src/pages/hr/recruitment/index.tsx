import React from 'react';
import ProCard from '@ant-design/pro-card';
import '../../hr/global.less'
import {ProCardModule,BarModule} from '../../../components/OA/ProCardComponent';

export default () => {
    const context = require['context']("../../../images/hr/", true, /\.(png|jpg)$/);//动态引入图片路径
        return (
            <div className="box">
                <BarModule title="IDL招聘管理系統" width="80%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./38.png')}  title='IDL職缺申請及招募'rPath="http://sc.wintalent.cn/wt/login!input?request_locale=zh_C" colSpan="15%" marginLeft='18%'/>
                    <ProCardModule imgPath={context('./38.png')} title='主管職缺申請及招募'rPath="http://wkseform.wistron.com/P63/FM_FormList.aspx" colSpan="15%"  />
                    <ProCardModule imgPath={context('./38.png')} title='新人申請招募'rPath="http://wkspetition.wistron.com.cn:1792/web/#/Apply" colSpan="15%"  />
                    <ProCardModule imgPath={context('./39.png')} title='AI視頻解析' colSpan="15%"  />
                    <ProCardModule imgPath={context('./40.png')} title='專案筆試系統'rPath="http://192.168.66.57:9001/#/backgroundLogin" colSpan="16%"  />
                </ProCard>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./41.png')} title='人才測評系統' colSpan="15%" marginLeft='18%'/>
                    <ProCardModule imgPath={context('./42.png')} title='雲招聘系統'rPath="http://sc.wintalent.cn/wt/login!input?request_locale=zh_CN" colSpan="15%"  />
                    <ProCardModule imgPath={context('./43.png')} title='積分綫上內薦'rPath="https://sc.hotjob.cn/wt/wistron/irmob/web/login" colSpan="15%"  />
                    <ProCardModule imgPath={context('./44.png')} title='IDL任用簽核系統'rPath="http://wkspetition.wistron.com.cn:1792/web/#/IDLCheckSalary" colSpan="15%"  />
                </ProCard>
                <BarModule title="DL招聘管理系統" width="80%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./9.png')} title='DL內薦費用核算'rPath="http://wkseform.wistron.com/P00/FM_FillForm.aspx" colSpan="15%" marginLeft='18%'/>
                    <ProCardModule imgPath={context('./9.png')} title='DL招募費用核算'rPath="http://wkseform.wistron.com/P00/FM_FillForm.aspx" colSpan="15%"  />
                </ProCard>
                <BarModule title="IDL&DL共用管理系統" width="80%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./45.png')} title='雲端電子合同' colSpan="15%" marginLeft='18%'/>
                </ProCard>
            </div>
           
        )
 }