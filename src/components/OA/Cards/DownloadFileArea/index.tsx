import React, { useState } from 'react';
import type { ProCardTabsProps } from '@ant-design/pro-card';
import ProCard from '@ant-design/pro-card';
import { Space, Select } from 'antd';

const { Option } = Select;

export default () => {
    const [tab, setTab] = useState('tab2');
    const [tabPosition, setTabPosition] = useState<ProCardTabsProps['tabPosition']>('top');

    return (<ProCard
        tabs={{
            activeKey: tab,
            onChange: (key) => {
                setTab(key);
            },
        }}
    >
        <ProCard.TabPane key="tab1" tab="产品一">
            内容一
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="产品二">
            内容二
        </ProCard.TabPane>
    </ProCard>
    );
};