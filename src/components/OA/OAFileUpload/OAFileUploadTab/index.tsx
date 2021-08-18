import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-form';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Popconfirm, Tabs } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadTemplate, getFileListByReferenceId, deleteFile } from './service';
import ProCard from '@ant-design/pro-card';
import { coreUtilsServiceUrl } from '../../serviceUrl';
import { FileInfoDto, OAFileUploadProps } from '../data';
import { useRef } from 'react';

const { TabPane } = Tabs;

const OAFileUploadTab: React.FC<OAFileUploadProps> = (props, ref) => {
  const { uploadColumns, title } = props;
  let uploadUid = '';

  const [excelUploadDataSource, setExcelUploadDataSource] = useState<any[]>([]);
  const [columns, setColumns] = useState<ProColumns[]>([]);

  const [referenceId, setReferenceId] = useState(props.referenceId);

  useImperativeHandle(ref, () => ({
    resetReferenceId: (newReferenceId: string) => {
      setReferenceId(newReferenceId);
      normalFileUploadTableRef.current?.reloadAndRest!();
    },
  }));

  const normalFileUploadTableRef = useRef<ActionType>();

  useEffect(() => {
    console.log('received uploadColumns format.', uploadColumns);
    if (!uploadColumns) {
      return;
    }
    const sampleData: any[] = [];

    uploadColumns.sort((a, b) => a.order - b.order);

    Object.keys(uploadColumns).map((x) => {
      columns.push({
        title: uploadColumns[x].title,
        dataIndex: uploadColumns[x].key,
      });
      sampleData[uploadColumns[x].key] = uploadColumns[x].sample;
    });
    setExcelUploadDataSource([sampleData]);
  }, [uploadColumns]);

  //TODO 類型檢查
  // const checkDataType = (item: any, type: string): boolean => {
  //     switch (type) {
  //         case "string":
  //             return item instanceof String;
  //         case "date":
  //             return item instanceof Date;
  //         case "number":
  //             return item instanceof Number;
  //         default:
  //             return item instanceof String;;
  //     }
  // }

  const normalFileUploadTableCoumns: ProColumns<FileInfoDto>[] = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      render: (dom, entity) => {
        return <a href={entity.previewUrl}>{entity.fileName}</a>;
      },
    },
    {
      title: '上傳人',
      dataIndex: 'createBy',
    },
    {
      title: '上傳時間',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (dom, entity, index) => [
        //TODO entity.canDelete &&
        <Popconfirm
          title="確定刪除?"
          onConfirm={() => {
            const result = deleteFile(entity.id);

            result.then((x) => {
              if (x.errorCode == 0) {
                message.success('刪除成功.' + entity.fileName);
                normalFileUploadTableRef.current?.reloadAndRest!();
              } else {
                message.error('刪除失敗.' + x.errorMessage);
              }
            });
          }}
          okText="Yes"
          cancelText="No"
        >
          {!props.readonly && <a key={index}>删除</a>}
        </Popconfirm>,
      ],
    },
  ];

  //下載模板
  const handleDownloadTemplate = async () => {
    uploadColumns && (await downloadTemplate(uploadColumns));
  };

  return (
    <Tabs defaultActiveKey={props.showTabs[0]} onChange={() => {}}>
      {props.showTabs?.includes('excel') && (
        <TabPane tab={title ? title : '上傳Excel文件並解析數據'} key="excel">
          {!props.readonly && (
            <ProCard>
              <ProCard colSpan={9}>
                <Button
                  key="add"
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTemplate}
                >
                  下载模板(上傳前,請刪除案例)
                </Button>
              </ProCard>
              <ProCard colSpan={15}>
                {uploadColumns && (
                  <ProFormUploadButton
                    action={`${coreUtilsServiceUrl}/file/uploadExcel`}
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    fieldProps={{
                      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                      maxCount: 1,
                      onRemove: (info) => {
                        setExcelUploadDataSource([]);
                        props.onExcelFinish &&
                          props.onExcelFinish?.fail &&
                          props.onExcelFinish?.fail([]);
                      },
                      onChange: (info) => {
                        console.log(info, '=============info============');
                        if (info.file.status === 'done' && info.file.uid != uploadUid) {
                          if (info.file.response.errorCode === 0) {
                            //組件bug.防止重複觸發
                            uploadUid = info.file.uid;

                            message.success('上傳成功');

                            console.log(info.file.response.data.list);
                            for (let x = 0; x < info.file.response.data.list.length; x++) {
                              const item = info.file.response.data.list[x];
                              for (let i = 0; i < uploadColumns.length; i++) {
                                const mapping = uploadColumns[i];

                                //校驗數據格式類型是否匹配
                                // if (mapping.type && !checkDataType(item[mapping.title], mapping.type)) {
                                //     message.error("數據格式不匹配。請檢查。" + item[mapping.title] + "期望的類型是" + mapping.type);
                                //     return;
                                // }

                                item[mapping.key] = item[mapping.title];
                                delete item[mapping.title];
                              }
                            }
                            console.log('parsed data', info.file.response.data.list);
                            setExcelUploadDataSource(info.file.response.data.list);
                            props.onExcelFinish &&
                              props.onExcelFinish?.success &&
                              props.onExcelFinish?.success(info.file.response.data.list);
                          } else {
                            message.error('上傳失敗.' + info.file.response.errorMessage);
                            setExcelUploadDataSource([]);
                          }
                        }
                      },
                    }}
                  />
                )}
              </ProCard>
            </ProCard>
          )}
          <ProTable
            pagination={{ pageSize: 5 }}
            toolBarRender={false}
            columns={columns}
            dataSource={excelUploadDataSource}
            size="small"
            search={false}
          ></ProTable>
        </TabPane>
      )}
      {props.showTabs?.includes('normal') && (
        <TabPane tab={title ? title : '上傳普通文件'} key="normal">
          {!props.readonly && (
            <ProCard>
              <ProCard colSpan={24}>
                <ProFormUploadButton
                  action={`${coreUtilsServiceUrl}/file/upload`}
                  fieldProps={{
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                    data: { referenceId: referenceId },
                    maxCount: 1,
                    onChange: (info) => {
                      if (info.file.status === 'done' && info.file.uid != uploadUid) {
                        if (info.file.response.errorCode === 0) {
                          //組件bug.防止重複觸發
                          uploadUid = info.file.uid;

                          message.success('上傳成功');
                          normalFileUploadTableRef?.current?.reloadAndRest!();
                        } else {
                          message.error('上傳失敗.' + info.file.response.errorMessage);
                          props.onExcelFinish &&
                            props.onExcelFinish?.fail &&
                            props.onExcelFinish?.fail([], info.file.response.errorMessage);
                        }
                      }
                    },
                  }}
                />
              </ProCard>
            </ProCard>
          )}

          <ProTable<FileInfoDto>
            actionRef={normalFileUploadTableRef}
            columns={normalFileUploadTableCoumns}
            pagination={{ pageSize: 5 }}
            toolBarRender={false}
            request={async () => {
              const result = await getFileListByReferenceId(referenceId);
              // console.log(result,"result-----------------------");
              props.onExcelFinish &&
                props.onExcelFinish?.success &&
                props.onExcelFinish?.success(result.data?.list);

              return {
                success: true,
                total: result.data?.list?.length,
                data: result.data?.list,
              };
            }}
            size="small"
            search={false}
          ></ProTable>
        </TabPane>
      )}
    </Tabs>
  );
};

export default forwardRef(OAFileUploadTab);
