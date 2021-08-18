import React from 'react';
import ProCard from '@ant-design/pro-card';
import '../../hr/global.less'
import {ProCardModule,BarModule} from '../../../components/OA/ProCardComponent';
 export default ()=>{
    const context = require['context']("../../../images/hr/", true, /\.(png|jpg)$/);//动态引入图片路径
        return (
            <div className="box">
                <BarModule title="IDL Training管理平台" width="80%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./27.png')} title='英文測試系統' rPath="https://livetest.cometolive.cn/Examination/Index/wistron3?wuid=1073106622" colSpan="15%" marginLeft='18%'/>
                    <ProCardModule imgPath={context('./28.png')} title='直播平台' rPath="https://my.polyv.net/v3/login" colSpan="15%"  />
                    <ProCardModule imgPath={context('./34.png')} title='專家技能管理系統' rPath="http://wksskill.wistron.com.cn/skillmanage/default.aspx" colSpan="15%"  />
                    <ProCardModule imgPath={context('./30.png')} title='緯創雲學院'rPath="http://wistron.yunxuetang.cn/login.htm" colSpan="15%"  />
                    <ProCardModule imgPath={context('./27.png')} title='英文測試流程管理系統' colSpan="16%"  />
                </ProCard>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./35.png')} title='外訓管理系統' colSpan="15%" marginLeft='18%' />
                    <ProCardModule imgPath={context('./29.png')} title='證照管理系統' colSpan="15%"  />
                </ProCard>
                <BarModule title="DL Training管理平台" width="80%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./36.png')} title='DL訓練考核系統' rPath="http://10.66.20.100:408/#/" colSpan="15%" marginLeft='18%'/>
                    <ProCardModule imgPath={context('./33.png')} title='DL電子簽到系統' colSpan="15%"  />
                    <ProCardModule imgPath={context('./37.png')} title='DL報表管理系統' rPath="http://mfgkm-wks.wistron.com/HR/default.aspx" colSpan="15%"  />
                    <ProCardModule imgPath={context('./9.png')}imgStyle={{width:'48px',height:'48px'}} title='DL技能津貼管理系統'rPath="http://wkseform.wistron.com/P37/FM_FillForm.aspx" colSpan="15%"  />
                    <ProCardModule imgPath={context('./9.png')}imgStyle={{width:'48px',height:'48px'}} title='DL證照津貼管理系統'rPath="http://wkseform.wistron.com/P37/FM_FillForm.aspx?FormID=P37F003" colSpan="15%"  />
                </ProCard>
                <ProCard className="cardBox">  
                     <ProCardModule imgPath={context('./31.png')}imgStyle={{width:'48px',height:'44px'}} title='DL特殊崗位管理系統' rPath="http://mic232.wks.wistron.com.cn/Portal/Login.aspx" colSpan="15%" marginLeft='18%'  />
                    <ProCardModule imgPath={context('./31.png')}imgStyle={{width:'48px',height:'44px'}} title='DL重點崗位管理系統'rPath="http://mic232.wks.wistron.com.cn/Portal/Login.aspx" colSpan="15%" />
                    <ProCardModule imgPath={context('./32.png')}imgStyle={{width:'48px',height:'48px'}} title='DL教材平台管理系統' rPath="http://mfgkm-wks.wistron.com/DL-ELearning/default.aspx" colSpan="15%"  />
                </ProCard>
            </div>
        )
 }