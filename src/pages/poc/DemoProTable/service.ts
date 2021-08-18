import { pocServiceUrl } from '@/components/OA/serviceUrl';
import { OAList, Result } from '@/data';
import { request } from 'umi';
import { JeasonEnglishExamApplyHead } from '../Demo/data';


export async function getJeasonApplyHead(params?: JeasonEnglishExamApplyHead){

    return request<Result<OAList<JeasonEnglishExamApplyHead[]>>>(`${pocServiceUrl}/getJeasonEnglishExamApplyHeadList`,{
        method: 'POST',
        data: params,
    })

}