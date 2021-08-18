import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import Ring from '../ChartComponent';
import {getfunctioncover,getoverrate,getoverratetrend,getvwcoursefunrate} from './service';
import {
    Chart,
    Geom,
    Axis,
    Label,
    Legend,
    Guide,
} from "bizcharts";
import './index.less'
import { await } from '@umijs/deps/compiled/signale';


const cols = {
    percent: {
        alias: '達成率'
    },
    date: {
        alias: '日期'
    }

};

const colsFuc = {
    percent: {
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        tickLine: null,
        alias: '達成率',
        formatter: (val: any) => {
            return val + '%'
        }
    },
    fuc: {
        alias: '部门'
    }

};

const RoadMap: React.FC<{}> = (props) => {
    const [functioncover,setfunctioncover]=useState({});
    const [cover,setcover]=useState('')
    const [nocover,setnocover]=useState('')
    const [myData,setmyData]=useState([{}])

    const [empqty,setempqty]=useState('')
    const [target,settarget]=useState('')
    const [fulfill,setfulfill]=useState({})
    const [rateDatax,setrateDatax]=useState([{}])
    const [vwHrReportOveralls,setvwHrReportOveralls]=useState([{}])
    const [dateTime,setdateTime]=useState('')
    const [average,setaverage]=useState('')

    const [vwcoursefunrates,setvwcoursefunrates]=useState([{}])
    const [GuideLine,setGuideLine]=useState([{}])
    const [finalThree,setfinalThree]=useState([{}])
    useEffect(async ()=>{
        //Function覆盖率
        const rate=await getfunctioncover();
        const myContent={percent:rate.coverrate+"%", siteCode: "覆蓋率",}
        const coverx=rate.cover
        const nocover=rate.noncover
        let coverrate=rate.coverrate
        if(coverrate!=100){
            coverrate="0."+coverrate
        }else{
            coverrate=1
        }
        const myDatax=[  
            { type: "已完成", percent:Number(coverrate)},
            { type: "未完成", percent:1-Number(coverrate) },
        ]
      
        setfunctioncover(myContent)
        setcover(coverx)
        setnocover(nocover)
        setmyData(myDatax)

        //Overall達成率
        const reach=await getoverrate();
        const rateRing={percent:reach.fulfill, siteCode: "達成率",}
        const empqtyx=reach.empqty
        const targetx=reach.target
        let a=reach.fulfill
        a=a.substring(0,2)
        a=Number(a)
        setaverage(a)
        if(a!=100){
            a="0."+a
        }else{
            a=1
        }
       //Overall達成率折线图
        const rateData=[  
            { type: "已完成", percent:Number(a)},
            { type: "未完成", percent:1-Number(a) },
        ]
        setfulfill(rateRing)
        setrateDatax(rateData)
        setempqty(empqtyx)
        settarget(targetx)

        const tendency=await getoverratetrend();
        const vwHrReportOverallsx=tendency.vwHrReportOveralls
        const dateTimex=tendency.dateTime
        const vs=[{}]
        vwHrReportOverallsx.map((item)=>{
            vs.push({date: item.crtdate,percent:Number(item.fulfill)})
        })
        setvwHrReportOveralls(vs)
        setdateTime(dateTimex)

        //各Function達成率狀況
        const vwcoursefunrate=await getvwcoursefunrate()
        const cf=[{}]
        //平均线起始和结束位置
        const cfx=[{}]
        const size=[]
        const dissize=[]
        vwcoursefunrate.map((item)=>{
            size.push(Number(item.percent))
            cf.push({fuc: item.fuc,percent:Number(item.percent)})
        })
        cfx.push({ fuc:vwcoursefunrate[0].fuc, percent: Number(a*100) })
        var c=vwcoursefunrate.length
        c=Number(c)-1
        cfx.push({ fuc:vwcoursefunrate[c].fuc, percent: Number(a*100)})
        setvwcoursefunrates(cf)
        setGuideLine(cfx)

        var compare = function (x, y) {//比较函数
            if (x < y) {
                return -1;
            } else if (x > y) {
                return 1;
            } else {
                return 0;
            }
        }
        size.sort(compare)

        for (var i = 0; i < size.length; i++) {
            if(dissize.indexOf(size[i])==-1){
                dissize.push(size[i]);
            }
         }
        setfinalThree(dissize)
    },[])
    
   
    return (
        <>
            <ProCard style={{padding:0}}gutter={[5, 0]}>
                <ProCard colSpan="25%" className="fcTitle" title="Function覆蓋率" headerBordered bordered>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                        <div style={{ display: 'flex' }} className="fcChart">
                            <Ring data={myData} content={functioncover} />
                        </div>

                        <div style={{ display: 'flex',flexDirection:'column'}}>
                            <span className="span1">未監控:<span>{nocover}</span> 個</span>
                            <span className="span2">已監控:<span>{cover}</span> 個</span>
                        </div>
                    </div>
                </ProCard>

                <ProCard colSpan="75%" className="fcrightTitle" title={"Overall達成率(5月)\xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0 \xa0  "+"Overall達成率趨勢("+dateTime+")"} headerBordered bordered>

                <div style={{display:'flex',justifyContent: 'space-around'}}>
                    <div className="OverallChart">
                        <Ring data={rateDatax} content={fulfill} />
                    </div>

                    <div style={{ display: 'flex',flexDirection:'column'}}> 
                        <span className="Ospan1">目  標:<span>{target}%</span></span>
                        <span className="Ospan2">人  數:<span>{empqty}</span>個</span>
                    </div>
                    
                    <div style={{ display: 'flex'}}>
                            <Chart height={80} width={450} data={vwHrReportOveralls} scale={cols}  forceFit>
                                <Axis
                                    name="percent"
                                    title={null}
                                    tickLine={null}
                                    line={false}
                                    grid={null}
                                    label={null}
                                />
                                <Axis
                                    name="date"
                                    title={null}
                                    tickLine={null}
                                    grid={null}
                                />
                                <Geom
                                    type="line"
                                    position="date*percent"
                                    size={1}
                                    color={"#39A8DD"}
                                    shape={"smooth"}
                                />
                                <Geom
                                    type="point"
                                    position="date*percent"
                                    size={2}
                                    shape={"circle"}
                                    color={"#39A8DD"}
                                    style={{
                                        stroke: "#fff",
                                        lineWidth: 1
                                    }}
                                > 
                                <Label 
                                    content="percent"
                                    formatter={(text:any, item:any, index:any)=>{
                                        // text 为每条记录 x 属性的值
                                        // item 为映射后的每条数据记录，是一个对象，可以从里面获取你想要的数据信息
                                        // index 为每条记录的索引
                                        var point = item.point; // 每个弧度对应的点
                                        var percent = point['percent'];
                                        return (percent * 100).toFixed(2) + '%';
                                    }}
                                    />  
                                 </Geom>             
                            </Chart>
                            </div> 
                </div>
                </ProCard>
            </ProCard>

            <ProCard colSpan="100%" className="card_buttom" >
                <div className="funTitle">
                    各Function達成率狀況
                </div>
                <div style={{ display: 'flex',justifyContent: 'space-center'}}>
                    <Chart
                        height={280}
                        width={920}
                        data={vwcoursefunrates}
                        scale={colsFuc} forceFit
                        onIntervalClick={(e: any) => {
                            console.log("單擊事件", e);
                            // (props?.history as any).push({
                            //     pathname: '/hr/roadMap/detail',
                            //     params: { fuc: e.data.data.fuc }
                            // })
                             window.location.href="/hr/roadMap/detail?fuc="+e.data.data.fuc
                        }}
                        
                    >
                        <Legend
                            name="percent"
                            position="top-right"
                            custom={true}
                            // allowAllCanceled={true}
                            items={[
                                {
                                    value: "平均達成率",
                                    name: "平均達成率",
                                    marker: {
                                        symbol: "hyphen",
                                        style: { stroke: '#3BAEE5' },
                                    },
                                },
                                {
                                    value: "達成率高於平均值",
                                    name: "達成率高於平均值",
                                    marker: {
                                        symbol: "square",
                                        style: { fill: '#21CC97' },
                                    },
                                },
                                {
                                    value: "達成率低於平均值",
                                    name: "達成率低於平均值",
                                    marker: {
                                        symbol: "square",
                                        style: { fill: '#FF9500' },
                                    },
                                },
                                {
                                    value: "達成率最低3個",
                                    name: "達成率最低3個",
                                    marker: {
                                        symbol: "square",
                                        style: { fill: '#D23B5F' },
                                    },
                                },
                            ]}
                        />
                        <Guide>
                            <Guide.Line
                                top={true}
                                start={GuideLine[1]} // 辅助线起始位置，值为原始数据值，支持 callback
                                end={GuideLine[2]} // 辅助线结束位置，值为原始数据值，支持 callback
                                style={{
                                    stroke: '#3BAEE5', // 线的颜色
                                    lineDash: [5], // 虚线的设置
                                    strokeOpacity:5,
                                    // startArrow: true,
                                    offsetX: 50, // {number} x 方向的偏移量
                                    offsetY: 50, // {number} y 方向的偏移量
                                }}
                                text={{
                                    position: 'start',
                                    autoRotate: true,
                                    style: {
                                        fill: '#3BAEE5',
                                    },
                                    offsetX: -40, // {number} x 方向的偏移量
                                    offsetY: 5, // {number} y 方向的偏移量
                                    content: {average}.average+'%', // {string} 文本的内容
                                }}
                            />
                        </Guide>
                        <Axis
                            name="percent"
                            grid={null}
                        />
                        <Axis name="fuc"
                            label={{
                                offset: 18,
                                rotate:100,
                            }}
                        />
                        <Geom
                            type="interval"
                            position="fuc*percent"
                            color={['percent', (percent: any) => {
                                if (percent >= {average}.average) {
                                    return '#21CC97';
                                }
                                else if (percent < {average}.average && percent>finalThree[2]) {
                                    return '#FF9500';
                                }
                                else {
                                    return '#D23B5F';
                                }
                            }]}
                        >
                            <Label content="percent" />
                        </Geom>

                    </Chart>
                </div>
            </ProCard>
        </>
    );
}
export default RoadMap;