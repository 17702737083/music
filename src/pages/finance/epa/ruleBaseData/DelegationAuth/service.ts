import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { DelegationAuthSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllDelegationAuth(sysDelegationAuth: DelegationAuthSource) {
  return request(`${epaServiceUrl}/baseData/findAllDelegationAuth`, {
    method: "POST",
    data: sysDelegationAuth,
  });
}
/**
 * 保存单行
 * @param sysDelegationAuth 
 * @returns 
 */
export async function saveDelegationAuth(sysDelegationAuth: DelegationAuthSource) {
  return request(`${epaServiceUrl}/baseData/saveDelegationAuth`, {
    method: "POST",
    data: sysDelegationAuth,
  });
}

/**
 * 保存所有
 * @param sysDelegationAuth 
 * @returns 
 */
 export async function saveAllDelegationAuth(sysDelegationAuths: DelegationAuthSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllDelegationAuth`, {
    method: "POST",
    data: sysDelegationAuths,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateDelegationAuth(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateDelegationAuth`, {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
      },
      params: {type:type},
      responseType: "blob"
  }).then(res => {
      const a = document.createElement("a")
      a.href = URL.createObjectURL(res)
      a.click()
      URL.revokeObjectURL(a.href)
      a.remove();
  });
}


