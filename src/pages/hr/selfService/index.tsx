import React from 'react';
import ProCard from '@ant-design/pro-card';
import '../../hr/global.less'
import {ProCardModule,BarModule} from '../../../components/OA/ProCardComponent';
 export default ()=>{
    const context = require['context']("../../../images/hr/", true, /\.(png|jpg)$/);//动态引入图片路径
        return (
            <div className="box">
                <BarModule title="考勤管理" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./14.png')} title='加班請假查詢' colSpan="14%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./16.png')} title='刷卡記錄查詢' colSpan="14%"  />
                    <ProCardModule imgPath={context('./17.png')} title='考勤異常查詢' colSpan="14%"  />
                    <ProCardModule imgPath={context('./25.png')} title='可休假時查詢' colSpan="14%"  />
                </ProCard>
                <BarModule title="薪資管理" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./22.png')} title='DL薪資查詢' colSpan="14%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./22.png')} title='DL津貼查詢' colSpan="14%"  />
                    <ProCardModule imgPath={context('./26.png')} title='DL技能申請/查詢' colSpan="14%"  />
                    <ProCardModule imgPath={context('./18.png')} title='獎懲記錄查詢' colSpan="14%"  />
                    <ProCardModule imgPath={context('./19.png')} title='智能客服' colSpan="14%"  />
                    <ProCardModule imgPath={context('./20.png')} title='人工客服' colSpan="14%"  />
                </ProCard>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./21.png')} title='社保服務查詢' colSpan="14%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./23.png')} title='公積金服務查詢' colSpan="14%"  />
                </ProCard>
                <BarModule title="考勤管理" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./3.png')} title='在職證明申請' colSpan="14%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./24.png')} title='上崗証補辦申請' colSpan="14%"  />
                    <ProCardModule imgPath={context('./2.png')} title='離職證明下載' colSpan="14%"  />
                </ProCard>
            </div>
        )
 }