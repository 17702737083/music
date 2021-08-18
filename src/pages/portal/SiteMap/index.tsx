import { useState, useEffect } from 'react'
import ProCard from "@ant-design/pro-card"
import { Anchor, Row, Col, Badge, Tabs, Popover, message, Typography,Tooltip,Input,Affix} from 'antd';
import { getSiteMap, getCategorylist, getMyFavouriteLink, getMyfavouriteCategory, getMyFavSubCategoryName, addMyFav, deleteByLinkId,findCategoryNameByNameLike,findCategoryByNameLike } from './service'
import { StarTwoTone, StarFilled } from '@ant-design/icons';
import styles from './index.less';
const { Search } = Input;
const { Text } = Typography;
const { Link } = Anchor;
const { TabPane } = Tabs;

/**
 * 群组链接
 */
type CategoryLink = {
    category: string;
    subcategorynames: LinkItem[];
}

/**
 * 每一个链接item
 */
type LinkItem = {
    id: number;
    del: string;
    time: number;
    url: string;
    isInMyFavorite: boolean;
    showFavoriteIcon: boolean
}

export default () => {
    
    const [targetOffset, setTargetOffset] = useState<number | undefined>(undefined);
    const [FindByLikeContent,setFindByLikeContent]=useState("");
    const [FindBylikeCount,setFindBylikeCount]=useState(0);

    const [categoryList, setcategoryList] = useState([{ "category": "" }]);
    const [cateGoryNamelist, setcateGoryNamelist] = useState<CategoryLink[]>([]);
    const [myFavcategorynameList, setmyFavcategorynameList] = useState([""]);

    const [favouriteCategory, setfavouriteCategory] = useState([{ "category": "" }]);
    const [MyFavouriteLink, setMyFavouriteLink] = useState<CategoryLink[]>([]);
    const [hiddenflag,setHiddenflag]=useState(true);
    useEffect(async () => {

        setTargetOffset(window.innerHeight / 9.5);

        const catlist=await getCategorylist()
        setcategoryList(catlist.data.list);
        
        const gsm=await getSiteMap()
        setcateGoryNamelist(gsm.data.list);

        const mfscn=await getMyFavSubCategoryName()
        if(mfscn.data!=null){
            setmyFavcategorynameList(mfscn.data.list);
        }
        

    }, []);

    const onMouseOver = (data: LinkItem) => {
            data.showFavoriteIcon = true;
            setcateGoryNamelist([...cateGoryNamelist]);
    }

    const onMouseOut = (data: LinkItem) => {
            data.showFavoriteIcon = false;
            setcateGoryNamelist([...cateGoryNamelist]);
    }

    const addfav = async (data: LinkItem) => {

        if(data.isInMyFavorite){
            await deleteByLinkId(data.id)
            message.success('移除成功');
            const MyFavSubCategoryName=await getMyFavSubCategoryName()
            if(MyFavSubCategoryName.data!=null){
                setmyFavcategorynameList(MyFavSubCategoryName.data.list)
            }else{
                setmyFavcategorynameList([])
            }
            
        }else{
            let res = await addMyFav(data.id)
            if (res == 1) {
                message.success('添加成功');
                const MyFavSubCategoryName=await getMyFavSubCategoryName()
                setmyFavcategorynameList(MyFavSubCategoryName.data.list)
            } else {
                message.error('添加失败');
            }
        } 
    }

    const content3 = (del:number) => (
        <a onClick={async () => {
            await deleteByLinkId(del)
            message.success('移除成功');

            const MyFavouriteLink= await getMyFavouriteLink()
            if(MyFavouriteLink.data!=null){
               setMyFavouriteLink(MyFavouriteLink.data.list)
            }else{
                setMyFavouriteLink([])
            }
           
            const MyfavouriteCategory= await getMyFavouriteLink()
            if(MyfavouriteCategory.data!=null){
                setfavouriteCategory(MyfavouriteCategory.data.list)
            }else{
                setfavouriteCategory([])
            }
           
        }}>移除</a>
    
    );

    return (
        
        <>
            <Tabs  defaultActiveKey="1" onChange={async (key) => {
                if (key == '2') {
                    const MyfavouriteCategory=await getMyfavouriteCategory()
                    if(MyfavouriteCategory.data!=null){
                        setfavouriteCategory(MyfavouriteCategory.data.list);
                    }
                   
                    const MyFavouriteLink=await getMyFavouriteLink()
                    if(MyFavouriteLink.data!=null){
                        setMyFavouriteLink(MyFavouriteLink.data.list);
                    }
                    
                } else {
                    setHiddenflag(true);
                    const catlist=await getCategorylist()
                    setcategoryList(catlist.data.list);
                    
                    const gsm=await getSiteMap()
                    setcateGoryNamelist(gsm.data.list);
            
                    const mfscn=await getMyFavSubCategoryName()
                    if(mfscn.data!=null){
                        setmyFavcategorynameList(mfscn.data.list);
                    }else{
                        setmyFavcategorynameList([])
                    }
                }

            }}>
         
  
                <TabPane tab="应用导航" key="1">
                    <Row>
                        <Col span={3}>
                            <Anchor targetOffset={targetOffset}>
                                {
                                    categoryList.map((item) => {
                                        return <Link href={'#' + item.category} title={item.category} />
                                    })
                                }
                            </Anchor>

                        </Col>
                        <Col span={21}>
        
                       
                        <Search placeholder="请输入关键词" style={{padding:10}}  enterButton onSearch={async(value)=>{
                              
                              const fc=await findCategoryByNameLike(value)
                               setcategoryList(fc.data.list);
                              const cgy=await findCategoryNameByNameLike(value)
                              setcateGoryNamelist(cgy.data.list);

                              let count=0;
                              cgy.data.list.map((item)=>{
                                count+=item.subcategorynames.length
                              })
                              setFindByLikeContent(value)
                              setFindBylikeCount(count)

                              if(value==""){
                                setHiddenflag(true);
                              }else{
                                setHiddenflag(false);
                              }
                             
                        }}/>
                       
                        <span style={{padding:10}} hidden={hiddenflag}>共找到{FindBylikeCount}条有关"{FindByLikeContent}"的链接</span>
                            {
                                cateGoryNamelist.map((item) => {
                                    return <div id={item.category} style={{padding:7}}>

                                        <ProCard  split="vertical">
                                            <ProCard colSpan="17%">
                                                <Text style={{ color: "#44cef6", fontWeight: "bold" }} >|&nbsp;&nbsp;{item.category}</Text>
                                            </ProCard>

                                            <ProCard.Group wrap>
                                                {
                                                    item.subcategorynames.map((data) => {

                                                        data.isInMyFavorite = myFavcategorynameList.indexOf(data.del) > -1;
                                                        return <ProCard className={styles.link}  colSpan={{ xs: 24, sm: 6, md: 6, lg: 3, xl: 6 }} 
                                                        onMouseEnter={() => onMouseOver(data)} 
                                                        onMouseLeave={() => onMouseOut(data)} 
                                                        layout="default" bordered>
                                                            <div>
                                                                {data.time <= 10
                                                                    ?
                                                                    <Badge dot>
                                                                        {
                                                                            data.url ? <a href={data.url} target='_blank'>{data.del}</a> : <span>{data.del}</span>
                                                                        }

                                                                    </Badge>
                                                                    :
                                                                    data.url ? <a href={data.url} target='_blank'>{data.del}</a> : <span>{data.del}</span>
                                                                }

                                                                {
                                                                    
                                                                (data.showFavoriteIcon || data.isInMyFavorite) && data.isInMyFavorite?
                                                                <Tooltip placement="right" title='取消收藏'>
                                                                    <StarFilled id={data.del} style={{float:'right',color: 'orange', fontSize: 18 }} onClick={() => addfav(data)}
                                                                   />
                                                                </Tooltip>:
                                                               
                                                                (data.showFavoriteIcon || data.isInMyFavorite) &&
                                                                <Tooltip color='orange' placement="right" title='加入收藏'>
                                                                     <StarTwoTone twoToneColor="orange" style={{ float:'right', fontSize: 18 }} onClick={() => addfav(data)}/>
                                                                 </Tooltip>    
                                                                }
                                                            </div>
                                                        </ProCard>
                                                    })
                                                }
                                            </ProCard.Group>
                                        </ProCard>
                                    </div>
                                })
                            }
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="我的最爱" key="2">
                    <Row>
                        <Col span={3}>
                            <Anchor targetOffset={targetOffset}>
                                {
                                    favouriteCategory.map((item) => {
                                        return <Link href={'#' + item.category + "f"} title={item.category} />
                                    })
                                }
                            </Anchor>

                        </Col>
                        <Col span={21}>
                            {
                                MyFavouriteLink.map((item) => {
                                    return <div id={item.category + "f"} style={{ marginTop: 10 }}>
                                        <ProCard split="vertical">
                                            <ProCard colSpan="20%">
                                                <Text style={{ color: "#44cef6", fontWeight: "bold" }} >|&nbsp;&nbsp;{item.category}</Text>
                                            </ProCard>

                                            <ProCard.Group wrap>
                                                {
                                                    item.subcategorynames.map((data) => {
                                                        return <ProCard  colSpan={{ xs: 24, sm: 6, md: 6, lg: 6, xl: 6 }} layout="center">
                                                            <div>
                                                                {data.time <= 10
                                                                    ?
                                                                    <Badge dot>
                                                                         <Popover content={content3(data.id)}>
                                                                        {
                                                                            data.url ? 
                                                                           
                                                                            <a href={data.url} target='_blank'>{data.del}</a>
                                                                            : 
                                                                            <span>{data.del}</span>
                                                                         
                                                                        }
                                                                        </Popover>
                                                                    </Badge>
                                                                    :
                                                                    <Popover content={content3(data.id)}>
                                                                   {data.url ?  
                                                                        <a href={data.url} target='_blank'>{data.del}</a>
                                                                     : 
                                                                        <span>{data.del}</span>
                                                                    } 
                                                                    </Popover>
                                                                }

                                                            </div>
                                                        </ProCard>
                                                    })
                                                }
                                            </ProCard.Group>
                                        </ProCard>
                                    </div>
                                })
                            }
                        </Col>
                    </Row>
                </TabPane>
                </Tabs>
        </>)
}