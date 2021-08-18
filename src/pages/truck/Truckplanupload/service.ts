import { request } from 'umi';
import type { TruckPlanUploadParams, TruckPlanUploadInfo } from './data';
import { truckServiceUrl } from '@/components/OA/serviceUrl';
import { OAList, Result } from '@/data';

export async function queryTruckPlanInfo(data?: TruckPlanUploadParams) {
  console.log('start query', data);
  return request<Result<OAList<TruckPlanUploadInfo[]>>>(`${truckServiceUrl}/truckPlanInfo/search`, {
    method: 'post',
    data,
  });
}

// export async function deleteTruckUrgent(params: TruckPlanUploadParams) {
//   console.log('start delete', params);
//   return request<Result<TruckPlanUploadInfo>>(`${truckServiceUrl}/truckUrgent/delete`, {
//     method: 'POST',
//     data: params,
//   });
// }

export async function uploadInDB(params?: any) {
  console.log('=======params=========', params);
  return request(`${truckServiceUrl}/truckPlanInfo/batchAdd`, {
    method: 'post',
    data: params,
  });
}
