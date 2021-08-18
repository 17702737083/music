import React,{useRef,useEffect} from 'react';
import ProCard from '@ant-design/pro-card';
import './index.less'
const ProCardModule= (props:any) => {
    const {imgPath,colSpan,title,marginLeft,imgStyle,rPath}=props;
    const titleRef=useRef();
    console.log(marginLeft)
    const handleClick=()=>{
        // window.location.href = rPath;
        if(rPath){
            window.open(rPath);
        }
    }
    useEffect(() => {
        if(rPath){
            (titleRef.current as any).style.color="green"
        }
    }, []);
      

    return(
        <ProCard className="bgbox" style={{height:'85px',display:'block',float:'left',background:'#1B1D1F',marginLeft:marginLeft}}  colSpan={colSpan}  layout="center" onClick={handleClick}>
            <div className="contentTitleBox" >
                <img src={imgPath} style={imgStyle}/>
                <span className='contentTitle'style={{width:'100px',height:'70px',color:'#FFFFFF',fontSize:'14px',textAlign:'center'}} ref={titleRef} >{title}</span>
            </div>
        </ProCard>
    )
}
const BarModule=(props:any)=>{
    const {title,width}=props;
        return (
            <div className='titleDiv' >
                <span className='title' style={{color:'#4EBBBB',fontSize:'20px',borderLeft:'4px solid  #4EBBBB',marginLeft:'20px',paddingLeft:'10px',width:'50px'}}>{title}</span><hr style={{width}}/>
            </div>
        )
}
export {ProCardModule,BarModule}