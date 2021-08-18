import { OAList, Result } from '@/data';
import { request } from 'umi';
import { ApplyReasonSelect, JeasonEnglishExamApplyHead } from "./data";


export async function saveHead(params?: JeasonEnglishExamApplyHead) {
    console.log('start query', params);
    return request<Result<JeasonEnglishExamApplyHead>>(`http://10.50.142.28:8080/save/head`, {
        method: 'POST',
        data: params
    });
  }


  export async function getApplyReasons(){
      return request<Result<OAList<ApplyReasonSelect[]>>>('http://10.50.142.28:8080/getApplyReasons')
  }