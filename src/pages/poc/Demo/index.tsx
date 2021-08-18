import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { useIntl, useModel } from 'umi';
import { JeasonEnglishExamApplyHead } from './data';
import { getApplyReasons, saveHead } from './service';

export default () => {
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();

  return (
    <ProForm
      title="考試申請"
      onFinish={async (values) => {
        console.log(values);
        const saveResult = await saveHead(values as JeasonEnglishExamApplyHead);
        console.log(saveResult);

        if (saveResult.errorCode == 0) {

          message.success(intl.formatMessage(
            {
              id: 'poc.demo.success',
              defaultMessage: '提交成功',
            }) + JSON.stringify(saveResult));
        } else {
          message.error('提交失敗' + saveResult.errorMessage);
        }

        return true;
      }}
    >
      <ProFormText name="creatorEmployeeId" />

      <ProFormText name="creatorDept" />

      <ProFormSelect
        name="applyReason"
        label={intl.formatMessage({
          id: 'poc.demo.applyReason',
          defaultMessage: '申請理由1',
        })}
        request={async () => {
          const applyReasons = await getApplyReasons();
          //initialState?.fetchDictInfo("12321");
          //  debugger;
          return applyReasons.data?.list;
        }}
        placeholder={`welcome ${initialState?.currentUser?.employeeInfoDTO?.cname}`}
        rules={[{ required: true, message: 'Please select your country!' }]}
      />
    </ProForm>
  );
};
