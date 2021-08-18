

import ProCard from '@ant-design/pro-card';
import { Space } from 'antd';

import { SiteMapCardProp } from './data';

const SiteMapCard: React.FC<SiteMapCardProp> = (props) => {

    const { title, data } = props;
    return (
        <ProCard title={title} bordered
            tabs={{
                tabPosition: "left"
            }}
        >
            {data && data.map((item, index) => {
                return <ProCard.TabPane key={"tab" + index} tab={item.name}>
                    <Space size="large" > {item.children.map((item, index) => {
                        return <a href={item.url}>{item.name}</a>
                    })}
                    </Space>
                </ProCard.TabPane>
            })}
        </ProCard>
    );
};

export default SiteMapCard;