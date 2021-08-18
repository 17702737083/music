import { request } from 'umi';

import { coreUtilsServiceUrl } from '@/components/OA/serviceUrl';
import { UploadColumn, FileInfoDto } from '../data';
import { OAList, Result } from '@/data';

export async function downloadTemplate(header: UploadColumn[]) {
  console.log('=======params=========', header);
  return request(`${coreUtilsServiceUrl}/file/downloadTemplate`, {
    method: 'post',
    data: header,
    responseType: 'blob',
  }).then((res: any) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(res);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  });
}
export async function uploadExcel(params?: any) {
  // console.log("=======params=========", params)
  return request(`${coreUtilsServiceUrl}/file/uploadExcel`, {
    method: 'post',
    params: params,
  }).then((res: any) => {
    console.log('res', res);
    return res;
  });
}

export async function getFileListByReferenceId(referenceId?: string) {
  return request<Result<OAList<FileInfoDto[]>>>(
    `${coreUtilsServiceUrl}/file/getFileListByReferenceId`,
    {
      method: 'get',
      params: { referenceId: referenceId },
    },
  );
}

export async function deleteFile(id: Number) {
  return request<Result<unknown>>(`${coreUtilsServiceUrl}/file/deleteById`, {
    method: 'post',
    params: { id: id },
  });
}
