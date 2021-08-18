import ProCard from '@ant-design/pro-card';
import '../../hr/global.less'
import {ProCardModule,BarModule} from '../../../components/OA/ProCardComponent';
export default () => {
    const context = require['context']("../../../images/hr/", true, /\.(png|jpg)$/);//动态引入图片路径
    return (
        <div className="box">
                <BarModule title="出勤管理" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./4.png')} title='DL&IDL出勤統計' rPath="http://smartfactory.wks.wistron.com/main"  colSpan="16%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./5.png')} title='連續出勤統計日報'rPath="http://10.66.22.140/" colSpan="14%"  />
                    <ProCardModule imgPath={context('./6.png')} title='連續出勤及工時月報' colSpan="15%"  />
                </ProCard>
                <BarModule title="IDL招聘" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./7.png')} title='IDL招聘進度看板' colSpan="16%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./3.png')} title='IDL進用率' colSpan="14%"  />
                    <ProCardModule imgPath={context('./2.png')} title='IDL離職率'imgStyle={{width:'48px',height:'48px'}}  colSpan="15%"  />
                    <ProCardModule imgPath={context('./8.png')} title='IDL人力結構分析' colSpan="15%"  />
                </ProCard>
                <BarModule title="DL招聘" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./6.png')} title='DL人力需求及供給報表' colSpan="16%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./3.png')} title='DL在職數據統計'rPath="http://smartfactory.wks.wistron.com/main" colSpan="14%"  />
                    <ProCardModule imgPath={context('./2.png')} imgStyle={{width:'48px',height:'48px'}} title='DL離職人數統計' rPath="http://smartfactory.wks.wistron.com/main" colSpan="14%"  />
                    <ProCardModule imgPath={context('./5.png')} title='DL進用率&離職率' colSpan="16%"  />
                    <ProCardModule imgPath={context('./15.png')} title='人力供應商考核管理報表' colSpan="17%"  />
                </ProCard>
                <ProCard className="cardBox">  
                <ProCardModule imgPath={context('./15.png')} title='DL離職原因分析報表' colSpan="16%" marginLeft='8%' />
                    <ProCardModule imgPath={context('./9.png')}imgStyle={{width:'48px',height:'48px'}} title='驻厂辅导员费用核算' colSpan="15%"  />
                </ProCard>
                <BarModule title="IDL訓練" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./12.png')} title='专家技能認證達成數據' colSpan="16%" marginLeft='8%'/>
                    <ProCardModule imgPath={context('./13.png')} title='Roadmap达成率' colSpan="14%"  />
                    <ProCardModule imgPath={context('./10.png')} title='训练达成比例' colSpan="15%"  />
                </ProCard>
                <BarModule title="DL訓練" width="90%"/>
                <ProCard className="cardBox">  
                    <ProCardModule imgPath={context('./11.png')} title='DL訓練認證動態看板' colSpan="16%" marginLeft='8%'/>
                </ProCard>
        </div>
    );
}