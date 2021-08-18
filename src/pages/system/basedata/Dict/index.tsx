import { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProField from '@ant-design/pro-field';
import ProCard from '@ant-design/pro-card';
import { Form, FormInstance } from 'antd';
import { deleteDictDetail, queryDictDetail, queryDictHead, saveDictDetail } from './service';
import { SysDictDetail, SysDictHead } from '@/data';
import { ProFormDependency, ProFormSelect } from '@ant-design/pro-form';
import React from 'react';

export default () => {

  const [dictDetailList, setDictDetailList] = useState<SysDictDetail[]>([]);
  const [dictHeadList, setDictHeadList] = useState<SysDictHead[]>([]);
  const [columns, setColumns] = useState<ProColumns<SysDictDetail>[]>();
  const [dictKeyValue, setDictKeyValue] = useState({});


  const form = useRef<FormInstance>();
  const action = useRef<ActionType>();

  useEffect(async () => {
    const tempHeadList = await queryDictHead();
    console.log(tempHeadList);
    generateColumns(tempHeadList.data?.list as SysDictHead[]);
    setDictHeadList(tempHeadList.data?.list as SysDictHead[]);
  }, []);

  // useEffect(async () => {
  //   debugger;
  //   generateColumns(dictHeadList);
  // }, [JSON.stringify({
  //   ...form.current?.getFieldValue("dictServiceKey"),
  //   ...form.current?.getFieldValue("dictGroupKey")
  // })]);




  const generateColumns = (dictHeadList: SysDictHead[]) => {

    const detailColumns: ProColumns<SysDictDetail>[] = [];

    detailColumns.push({
      title: '服务名称',
      key: 'dictServiceKey',
      dataIndex: 'dictServiceKey',
      valueType: 'select',
      editable: false,
      valueEnum: () => {
        const options = {};
        dictHeadList.forEach((item) => {
          options[item.dictServiceKey] = item.dictServiceName
        });
        return options;
      },
    });

    detailColumns.push({
      title: '群组名称',
      editable: false,
      renderFormItem: () => {
        return <ProFormDependency name={['dictServiceKey']}>
          {({ dictServiceKey }) => {
            if (!dictServiceKey) {
              return;
            }
            // debugger;
            const options: { label?: string; value: string }[] = [];
            dictHeadList && dictHeadList
              .filter(x => x.dictServiceKey === dictServiceKey)
              .forEach(item => {
                if (options.filter(x => x.value == item.dictGroupKey).length < 1) {
                  options.push({
                    label: item.dictGroupName,
                    value: item.dictGroupKey
                  });
                }
              });
            console.log(options);
            return (
              <ProFormSelect
                name="dictGroupKey"
                options={options}
              />
            );
          }}
        </ProFormDependency>
      }
    });

    detailColumns.push({
      title: '字典名称',
      editable: false,
      renderFormItem: () => {
        return <ProFormDependency name={['dictServiceKey', 'dictGroupKey']}>
          {({ dictServiceKey, dictGroupKey }) => {
            // debugger;
            if (!dictServiceKey || !dictGroupKey) {
              return;
            }
            const options: { label?: string; value: string }[] = [];
            dictServiceKey && dictGroupKey && dictHeadList && dictHeadList
              .filter(x => x.dictServiceKey === dictServiceKey && x.dictGroupKey === dictGroupKey)
              .forEach(item => {
                if (options.filter(x => x.value == item.dictKey).length < 1) {
                  options.push({
                    label: item.dictKeyName,
                    value: item.dictKey
                  });
                }
              });
            console.log(options);
            return (
              <ProFormSelect
                name="dictKey"
                options={options}
              />
            );
          }}
        </ProFormDependency>
      }
    });
    detailColumns.push({
      title: '字典排序',
      key: 'dictValueSort',
      dataIndex: 'dictValueSort',
    });

    dictHeadList && dictHeadList
      .filter(x => x.dictServiceKey === form?.current?.getFieldValue("dictServiceKey") && x.dictGroupKey === form?.current?.getFieldValue("dictGroupKey") && x.dictKey === form?.current?.getFieldValue("dictKey"))
      .map((item) => {
        const headerColumns = item.sysDictDetailList?.filter(x => x.dictValueSort === 0);

        const headerColumn = JSON.parse(headerColumns?.[0]?.dictValue as string)
        Object.keys(headerColumn).map((key) => {
          detailColumns.push({
            title: headerColumn[key],
            key: key,
            dataIndex: key,
          });
        });
      });

    detailColumns.push({
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action && action.startEditable?.(record.id as number);
          }}
        >
          编辑
        </a>,
        <EditableProTable.RecordCreator
          record={{
            ...form?.current?.getFieldsValue(),
            ...record,
            id: Math.random() * 1000000,
          }}
        >
          <a>复制此行到末尾</a>
        </EditableProTable.RecordCreator>,
      ]
    });


    setColumns(detailColumns);
  }


  const fetchRemoteData = async (params: SysDictHead) => {
    console.log("params", params);
    generateColumns(dictHeadList);

    const tempDictDetailList: SysDictDetail[] = [];

    const originDictDetailList = await queryDictDetail(params.dictKey);

    originDictDetailList.data?.list
      .filter(item => item.dictValueSort === 0)
      .forEach(item => setDictKeyValue(JSON.parse(item.dictValue as string)));

    originDictDetailList.data?.list
      .filter(item => item.dictValueSort !== 0)
      .sort((next, pre) => next.dictValueSort - pre.dictValueSort)
      .forEach(item => {
        const valueObj = JSON.parse(item.dictValue as string);
        const tempDetail: SysDictDetail = {};
        Object.keys(valueObj).map((key) => {
          tempDetail[key] = valueObj[key];
        });
        console.log("sorted item", item.dictValueSort);
        tempDictDetailList.push({ ...params, ...tempDetail, ...item });
      })

    setDictDetailList(tempDictDetailList);

    return {
      data: tempDictDetailList,
      total: tempDictDetailList.length,
      success: true,
    };
  }









  return (
    <>
      <EditableProTable<SysDictDetail>
        formRef={form}
        search={{
          collapsed: false
        }}
        actionRef={action}
        request={fetchRemoteData}
        headerTitle="数据字典维护"
        columns={columns}
        rowKey="id"
        value={dictDetailList}
        onChange={setDictDetailList}
        recordCreatorProps={{
          record: {
            ...form?.current?.getFieldsValue(),
            id: Math.random() * 1000000,
          }
        }}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.delete, defaultDoms.cancel];
          },
          onSave: async (key, row) => {
            Object.keys(dictKeyValue).forEach(x => {
              dictKeyValue[x] = row[x];
            });
            row.dictValue = JSON.stringify(dictKeyValue);
            const result = await saveDictDetail(row as SysDictDetail);
            row.id = result.data?.id;
          },
          onDelete: async (key, row) => {
            await deleteDictDetail(row as SysDictDetail);
          }
        }}
      />
      <ProCard title="表格数据" headerBordered collapsible>
        <ProField
          fieldProps={{
            style: {
              width: '100%',
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dictDetailList)}
        />
      </ProCard>
    </>
  );
};

