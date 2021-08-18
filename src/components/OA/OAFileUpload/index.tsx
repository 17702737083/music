import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import OAFileUploadTab from './OAFileUploadTab';
import { OAFileUploadProps } from './data';








const OAFileUpload: React.FC<OAFileUploadProps> = (props) => {

    const { mode, title } = props;

    const [visible, setVisible] = useState(false);



    return (
        mode == "button" ?
            <>
                <Button type="primary" onClick={() => setVisible(true)}>
                    <PlusOutlined />上傳文件
                </Button>

                <Modal
                    title={title ? title : "上傳文件"}
                    width={0.7 * window.innerWidth}
                    onCancel={() => setVisible(false)}
                    footer={false}
                    visible={visible}
                >
                    <OAFileUploadTab
                        {...props}
                    />
                </Modal>
            </>
            :
            <OAFileUploadTab
                {...props}
            />
    );
};
export default OAFileUpload;