import { request } from '@/app';
import OAFileUpload from '@/components/OA/OAFileUpload';
import { UploadColumn } from '@/components/OA/OAFileUpload/data';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { JeasonEnglishExamApplyHead } from '../Demo/data';
import { getJeasonApplyHead } from './service';

// id:number;
// createBy:string;
// creatorEmployeeId:string;
// creatorDept:string;

export default () => {
  const columns: ProColumns<JeasonEnglishExamApplyHead>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '創建人',
      dataIndex: 'createBy',
    },
    {
      title: '另外一種創建人工號',
      dataIndex: 'creatorEmployeeId',
    },
    {
      title: '創建人部門',
      dataIndex: 'creatorDept',
    },
  ];

  const uploadTemplateColumns: UploadColumn[] = [
    {
      order: 1,
      key: 'id',
      title: '序列號',
      sample: '1',
    },
    {
      order: 2,
      key: 'createBy',
      title: '創建人工號',
      sample: 'K1105Z320',
    },
    {
      order: 5,
      key: 'creatorEmployeeId',
      title: '另外一種創建人工號',
      sample: 'JEASON ZHU',
    },
    {
      order: 4,
      key: 'creatorDept',
      title: '部門代碼',
      sample: 'DML120',
    },
  ];
  const actionRef = useRef<ActionType>();

  const [dataSource, SetDataSource] = useState<JeasonEnglishExamApplyHead[]>([]);

  useEffect(() => {
    // debugger;
    actionRef.current?.reloadAndRest!();
  }, []);

  return (
    <>
      <OAFileUpload showTabs={['excel', 'normal']} mode="tab" referenceId="123"></OAFileUpload>
      <ProTable<JeasonEnglishExamApplyHead>
        columns={columns}
        request={async (params: JeasonEnglishExamApplyHead, sort, filter) => {
          console.log(sort, filter);

          const res = await getJeasonApplyHead(params);

          return {
            data: res.data?.content,
            total: res?.data?.totalElements,
            success: res.errorCode === 0,
          };
        }}
        dataSource={dataSource}
        pagination={{
          pageSize: 5,
        }}
        actionRef={actionRef}
        toolBarRender={() => [
          <OAFileUpload
            uploadColumns={uploadTemplateColumns}
            showTabs={['excel']}
            mode="button"
            onExcelFinish={{
              success: async (data) => {
                // debugger;
                SetDataSource(data as JeasonEnglishExamApplyHead[]);
              },
            }}
          ></OAFileUpload>,
        ]}
      />
    </>
  );
};
