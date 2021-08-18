import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { SummaryRuleSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllSummaryRule(empId:string,sysCostRule: SummaryRuleSource) {
  return request(`${epaServiceUrl}/baseData/findAllSummaryRule`, {
    method: "POST",
    params:{empId:empId},
    data: sysCostRule,
  });
}
/**
 * 保存单行
 * @param sysSummaryRule 
 * @returns 
 */
export async function saveSummaryRule(sysCostRule: SummaryRuleSource) {
  return request(`${epaServiceUrl}/baseData/saveSummaryRule`, {
    method: "POST",
    data: sysCostRule,
  });
}

/**
 * 保存所有
 * @param sysSummaryRule 
 * @returns 
 */
 export async function saveAllSummaryRule(type:string,sysSummaryRule: SummaryRuleSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllSummaryRule`, {
    method: "POST",
    params:{type:type},
    data: sysSummaryRule,
  });
}

/**
 * 下载模板 
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateSummaryRule(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateSummaryRule`, {
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


