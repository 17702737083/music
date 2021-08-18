import { epaServiceUrl } from "@/components/OA/serviceUrl";
import request from "umi-request";
import { CostDelegationAuthSource } from "../../data";
/**
 * 查询所有
 * @returns 
 */
export async function findAllCostDelegationAuth(empId:string,sysCostDelegationAuth: CostDelegationAuthSource) {
  return request(`${epaServiceUrl}/baseData/findAllCostDelegationAuth`, {
    method: "POST",
    params:{empId:empId},
    data: sysCostDelegationAuth,
  });
}
/**
 * 保存单行
 * @param sysCostDelegationAuth 
 * @returns 
 */
export async function saveCostDelegationAuth(sysCostDelegationAuth: CostDelegationAuthSource) {
  return request(`${epaServiceUrl}/baseData/saveCostDelegationAuth`, {
    method: "POST",
    data: sysCostDelegationAuth,
  });
}

/**
 * 保存所有
 * @param sysCostDelegationAuths 
 * @returns 
 */
 export async function saveAllCostDelegationAuth(type:string,sysCostDelegationAuths: CostDelegationAuthSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCostDelegationAuth`, {
    method: "POST",
    params:{type:type},
    data: sysCostDelegationAuths,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function downTemplateCostDelegationAuth(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCostDelegationAuth`, {
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


