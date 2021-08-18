import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { CostRulesSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllCostRules(empId:string,sysCostRule: CostRulesSource) {
  return request(`${epaServiceUrl}/baseData/findAllCostRules`, {
    method: "POST",
    params:{empId:empId},
    data: sysCostRule,
  });
}
/**
 * 保存单行
 * @param sysCostRules 
 * @returns 
 */
export async function saveCostRules(sysCostRule: CostRulesSource) {
  return request(`${epaServiceUrl}/baseData/saveCostRules`, {
    method: "POST",
    data: sysCostRule,
  });
}

/**
 * 保存所有
 * @param sysCostRules 
 * @returns 
 */
 export async function saveAllCostRules(type:string,sysCostRules: CostRulesSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCostRules`, {
    method: "POST",
    params:{type:type},
    data: sysCostRules,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateCostRules(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCostRules`, {
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


