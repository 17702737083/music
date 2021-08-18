import { List } from "lodash";
import { request } from "umi"; 
import { tpcnServiceUrl,examineServiceUrl } from "@/components/OA/serviceUrl";


export async function saveTpcnDetail(datas) {
  return request(`${tpcnServiceUrl}/tpcn/insert/inserttpcnForm`, {
    method: "POST",
    data: datas,
  });
}

/**
 * 初始化单据
 * @param referenceId
 * @returns
 */

export async function backFormData(referenceId:string) {
  return request(`${tpcnServiceUrl}/tpcn/query/querytpcnBase`,{
    method:'POST',
    params:{referenceId : referenceId}
  })
}

export async function saveMecnDetail(dictDetail: API.MecnDetail) {
  return request<API.MecnDetail>(`${examineServiceUrl}print/insertPrintApply2`, {
    method: "POST",
    data: dictDetail,
  });
}