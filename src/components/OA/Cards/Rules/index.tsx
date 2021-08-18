import React from 'react';
import { Button, Tag } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import mask from '@/images/portal/mask.jpg';
import yq from '@/images/portal/yq.jpg';

const IconText = ({ icon, text }: { icon: any; text: string }) => (
    <span>
        {React.createElement(icon, { style: { marginRight: 8 } })}
        {text}
    </span>
);

const dataSource = [
    {
        title: '防疫規範',
        content: '非必要不跨境出行.不去中高風險區域.',
        image: yq,
        tag: ["防疫","區域管控"]
    },
    {
        title: '個人防護',
        content: '疫情期間,每周填寫宣告書.辦公室需戴口罩.',
        image: mask,
        tag: ["個人防護"]
    },
];

export default () => {
    return (
        <ProList<{ title: string, content: string, image: any, tag: string[] }>
            itemLayout="vertical"
            rowKey="id"
            dataSource={dataSource}
            metas={{
                title: {},
                description: {
                    render: (dom, entity) => (
                        <>
                            {entity.tag.map((item, index) => {
                                return <Tag key={index}>{item}</Tag>
                            })}
                        </>
                    ),
                },
                actions: {
                    render: () => [
                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                    ],
                },
                extra: {
                    render: (dom, entity) => (
                        <img
                            height={150}
                            alt="logo"
                            src={entity.image}
                        />
                    ),
                },
                content: {
                    render: (dom, entity) => {
                        return (
                            <div>
                                {entity.content}
                            </div>
                        );
                    },
                },
            }}
        />
    );
};