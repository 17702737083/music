import ProCard from '@ant-design/pro-card';
import { Select, Col, Row, Typography } from 'antd';
import News from '@/components/OA/Cards/News';
import Todo from '../system/user/inbox/Todo';
import OAFileUpload from '@/components/OA/OAFileUpload';
import SystemLink from '@/components/OA/Cards/SystemLink';
import DeptManHours from '@/components/OA/Cards/DeptManHours';
import NotificationCard from '@/components/OA/Cards/NotificationCard';

import styles from './index.less';

const { Text, Link, Title } = Typography;

const { Option } = Select;

export default () => {

    return (

        <>
            <Row gutter={[16, 16]} >
                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}  >待簽核表單</Text>} >
                        <Todo />
                    </ProCard>
                </Col>

                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}  >待處理事項</Text>} >
                        <Todo />
                    </ProCard>
                </Col>

                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}  >新闻公告</Text>} extra={<a href="#">More</a>}>
                        <News />
                    </ProCard>
                </Col>

                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle} >应用导航</Text>} extra={<a href="/portal/sitemap">More</a>}>
                        <ProCard>
                            <SystemLink />
                        </ProCard>
                    </ProCard>
                </Col>


                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}  >下載中心</Text>} extra={<a href="#">More</a>} >
                        <ProCard>
                            <OAFileUpload
                                showTabs={["normal"]}
                                referenceId={"123"}
                                title="常用文件下載"
                                mode="tab"
                                readonly />
                        </ProCard>
                    </ProCard>
                </Col>

                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}  >熱點資訊</Text>} extra={<a href="https://voice.baidu.com/act/newpneumonia/newpneumonia#tab0">More</a>}>
                        <ProCard>
                            <iframe  src="https://voice.baidu.com/act/newpneumonia/newpneumonia#tab0" frameBorder="0" width="100%" height="460px" allowTransparency={true}></iframe>
                        </ProCard>
                    </ProCard>
                </Col>

                <Col span={12}>
                    <ProCard className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}  >人力分布</Text>} extra={<a href="#">More</a>}>
                        <DeptManHours />
                    </ProCard>
                </Col>

                <Col span={12}>
                    <ProCard split="horizontal" className={styles.portalCard} ghost title={<Text className={styles.portalCardTitle}      >智能助手</Text>} extra={<a href="#">More</a>}>
                        <ProCard size="small" >
                            <NotificationCard />
                        </ProCard>
                        <ProCard>
                            <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=tw&skin=sogou" frameBorder="0" width="100%" height="460px" allowTransparency={true}></iframe>
                        </ProCard>
                    </ProCard>
                </Col>


            </Row>
        </>
    );
};