import { request } from 'umi';
import type { TruckPlanInfo, ExtraData } from './data';
import { truckServiceUrl } from '@/components/OA/serviceUrl';
import { OAList, Result } from '@/data';
import moment from 'moment';

export async function queryTruckPlanInfo(params?: TruckPlanInfo) {
  console.log('start query', params);
  return request<Result<OAList<TruckPlanInfo[]>>>(`${truckServiceUrl}/truckPlanInfo/search`, {
    params,
  });
}

export async function exportExcel(params?: TruckPlanInfo) {
  console.log('start download', params);
  request(`${truckServiceUrl}/truckPlanInfo/download`, {
    params,
    responseType: 'blob',
  }).then((res) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(res);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  });
}

export async function releaseTruck(params: TruckPlanInfo[], extraData: ExtraData) {
  console.log('releasae', params);

  return request<Result<TruckPlanInfo>>(`${truckServiceUrl}/truckPlanInfo/release`, {
    method: 'POST',
    data: {
      truckPlanInfos: params,
      ...extraData,
    },
  });
}

export async function addTruckPlanInfo(params: TruckPlanInfo) {
  params.actualDeliveryTime = moment(params?.actualDeliveryTime).toDate();
  params.leaveTime = moment(params?.leaveTime).toDate();
  return request<Result<TruckPlanInfo>>(`${truckServiceUrl}/truckPlanInfo/add`, {
    method: 'POST',
    data: params,
  });
}

export async function updateTruckPlanInfo(params: TruckPlanInfo) {
  debugger;
  params.actualDeliveryTime = moment(params?.actualDeliveryTime).toDate();
  params.leaveTime = moment(params?.leaveTime).toDate();
  console.log('start 2nd update', params);
  return request<Result<TruckPlanInfo>>(`${truckServiceUrl}/truckPlanInfo/update`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteTruckPlanInfo(params: TruckPlanInfo) {
  console.log('start delete', params);
  return request<Result<TruckPlanInfo>>(`${truckServiceUrl}/truckPlanInfo/delete`, {
    method: 'POST',
    data: params,
  });
}

export async function openCardIdDevice() {
  return request('http://localhost:19196/OpenDevice');
}

export async function closeCardIdDevice() {
  return request('http://localhost:19196/CloseDevice');
}

export async function loadIdCardInfo() {
  return request('http://localhost:19196/readcard');
}

export async function addAny(params?: []) {
  return request<Result<OAList<TruckPlanInfo[]>>>(`${truckServiceUrl}/truckPlanInfo/addAny`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
  }).catch((err) => {
    console.error(err);
  });
}
