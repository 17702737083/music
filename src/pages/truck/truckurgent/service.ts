import { request } from 'umi';
import type { TableListParams,TruckUrgentInfo } from './data';
import { truckServiceUrl } from '@/components/OA/serviceUrl';
import { OAList, Result } from '@/data';

  export async function queryTruckPlanInfo(params?: TruckUrgentInfo) {
    console.log('start query', params);
    return request<Result<OAList<TableListParams[]>>>(`${truckServiceUrl}/truckUrgent/search`, {
      params,
    });
  }

  export async function deleteTruckUrgent(params: TruckUrgentInfo) {
    console.log('start delete', params);
    return request<Result<TruckUrgentInfo>>(`${truckServiceUrl}/truckUrgent/delete`, {
      method: 'POST',
      data: params,
    });
  }
  
export async function uploadInDB(params?: any) {
  console.log("=======params=========", params);
  return request(`${truckServiceUrl}/truckUrgent/uploadInDB`, {
    method: 'post',
    data: params,
  }).then((res: any) => {
    console.log('res', res);
    return res;
  })
}