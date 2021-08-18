import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Badge, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { Typography, Space } from 'antd';

const { Text, Link } = Typography;
type NewInfo = {
    title: string;
    tag: string;
    creater: string;
    pic: string;
    createDate: string;
    url: string;
};


const tableListDataSource: NewInfo[] = [
    {
        title: "2021年 【安全環保月】給您充話費啦~",
        tag: "環安系統",
        creater: "行政訊息",
        pic: "Betty Jiao",
        createDate: "2021-07-07",
        url: "http://eip-wks.wistron.com/info/Pages/%e3%80%90%e7%92%b0%e5%ae%89%e7%b3%bb%e7%b5%b1%e3%80%91%e7%92%b0%e5%ae%89%e7%b5%a6%e6%82%a8%e5%85%85%e8%a9%b1%e8%b2%bb%e5%95%a6.aspx"
    },
    {
        title: "汉文化社7月簪娘缠花活动开始报名啦~",
        tag: "社團活動",
        creater: "社團天地",
        pic: "MEH210/Sunny He",
        createDate: "2021-07-07",
        url: "http://eip-wks.wistron.com/info/Pages/%e3%80%90%e7%a4%be%e5%9c%98%e6%b4%bb%e5%8b%95%e3%80%91%e6%b1%89%e6%96%87%e5%8c%96%e7%a4%be7%e6%9c%88%e7%b0%aa%e5%a8%98%e7%bc%a0%e8%8a%b1%e6%b4%bb%e5%8a%a8%e6%9d%a5%e8%a2%ad%e5%95%a6.aspx"
    },
    {
        title: "纬创家庭开放日活动报名持续火热进行中",
        tag: "緯創20周年",
        creater: "文體活動",
        pic: "HR/May Zu",
        createDate: "2021-07-07",
        url: "http://eip-wks.wistron.com/info/Pages/%e5%ae%b6%e5%ba%ad%e5%bc%80%e6%94%be%e6%97%a5%e6%b4%bb%e5%8a%a8%e9%95%bf%e5%9b%be.aspx"
    },
    {
        title: "2021緯績數字展會邀請函",
        tag: "廠區訊息",
        creater: "廠區訊息",
        pic: "員工關系部",
        createDate: "2021-07-07",
        url: "http://eip-wks.wistron.com/info/Pages/%e3%80%90%e5%bb%a0%e5%8d%80%e8%a8%8a%e6%81%af%e3%80%912021%e7%b7%af%e5%89%b5%e6%95%b8%e5%ad%97%e5%b1%95%e6%9c%83%e9%82%80%e8%ab%8b%e5%87%bd.aspx"
    },
    {
        title: "恭喜緯創足球队獲得開發區五人制足球賽第四名～～",
        tag: "社團天地",
        creater: "社團天地",
        pic: "MEH210/Todd Cheng",
        createDate: "2021-07-06",
        url: "http://eip-wks.wistron.com/info/Pages/%e3%80%90%e7%a4%be%e5%9c%98%e5%a4%a9%e5%9c%b0%e3%80%91%e6%81%ad%e5%96%9c%e7%b7%af%e5%89%b5%e8%b6%b3%e7%90%83%e9%98%9f%e7%8d%b2%e5%be%97%e9%96%8b%e7%99%bc%e5%8d%80%e4%ba%94%e4%ba%ba%e5%88%b6%e8%b6%b3%e7%90%83%e8%b3%bd%e7%ac%ac%e5%9b%9b%e5%90%8d%ef%bd%9e%ef%bd%9e.aspx"
    },
    {
        title: "2021首届家庭開放日活動報名開始啦~~",
        tag: "緯創20周年",
        creater: "文體活動",
        pic: "HR/May Zu",
        createDate: "2021-07-05",
        url: "http://eip-wks.wistron.com/info/Pages/%e5%ae%b6%e5%ba%ad%e5%bc%80%e6%94%be%e6%97%a5%e6%b4%bb%e5%8a%a8%e9%95%bf%e5%9b%be.aspx"
    },

];

const renderBadge = (count: number, active = false) => {
    return (
        <Badge
            count={count}
            style={{
                marginTop: -2,
                marginLeft: 4,
                color: active ? '#1890FF' : '#999',
                backgroundColor: active ? '#E6F7FF' : '#eee',
            }}
        />
    );
};



const NewInfoList: React.FC = () => {

    const [activekey, setActiveKey] = useState<React.Key>('tab5');

    const columns: ProColumns<NewInfo>[] = [
        {
            dataIndex: 'title',
            title: '主旨',
            ellipsis: true,
            width: "300px",
            render: (dom, record) => (
                <Link
                    style={{ width: 250 }}
                    ellipsis={true}
                    href={record.url} target="_blank">
                    <Tooltip title={record.title} > {record.title}</Tooltip>
                </Link>
            ),
        },
        {
            dataIndex: 'creater',
            title: '發文單位',
            filters: true,
            onFilter: true,
            valueEnum: {
                all: { text: '行政訊息', status: 'Default' },
                close: { text: '社團天地', status: 'Default' },
                running: { text: '文體活動', status: 'Processing' },
                online: { text: '廠區訊息', status: 'Success' },
                wc: { text: '緯創20周年', status: 'Success' },
            },
        },
        {
            dataIndex: 'pic',
            title: '發文者',
            width: 150
        },
        {
            dataIndex: 'createDate',
            title: '發文時間',
        },
    ];

    return (
        <ProTable<NewInfo>
            columns={columns}
            request={(params, sorter, filter) => {
                // 表单搜索项会从 params 传入，传递给后端接口。
                console.log(params, sorter, filter);
                return Promise.resolve({
                    data: tableListDataSource,
                    success: true,
                });
            }}
            rowKey="title"
            pagination={{
                pageSize: 5
            }}
            toolbar={
                {
                    menu: {
                        type: 'tab',
                        activeKey: activekey,
                        items: [
                            {
                                key: 'tab5',
                                label: <span>緯創20周年{renderBadge(8, activekey === 'tab3')}</span>,
                            }, {
                                key: 'tab1',
                                label: <span>行政訊息{renderBadge(18, activekey === 'tab1')}</span>,
                            },
                            {
                                key: 'tab2',
                                label: <span>社團天地{renderBadge(28, activekey === 'tab2')}</span>,
                            },
                            {
                                key: 'tab3',
                                label: <span>文體活動{renderBadge(88, activekey === 'tab3')}</span>,
                            },
                        ],
                        onChange: (key) => {
                            setActiveKey(key as string);
                        },
                    }
                }
            }
            search={false}
            size={"small"}

        />
    );
};

export default NewInfoList;









