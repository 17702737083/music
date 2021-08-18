import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { ProfitCenterSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllProfitCenter(sysProfitCenter: ProfitCenterSource) {
  return request(`${epaServiceUrl}/baseData/findAllProfitCenter`, {
    method: "POST",
    data: sysProfitCenter, 
  });
}
/**
 * 保存单行
 * @param sysProfitCenter 
 * @returns 
 */
export async function saveProfitCenter(sysProfitCenter: ProfitCenterSource) {
  return request(`${epaServiceUrl}/baseData/saveProfitCenter`, {
    method: "POST",
    data: sysProfitCenter,
  });
}

/**
 * 保存所有
 * @param sysProfitCenter 
 * @returns 
 */
 export async function saveAllProfitCenter(sysProfitCenters: ProfitCenterSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllProfitCenter`, {
    method: "POST",
    data: sysProfitCenters,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateProfitCenter(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateProfitCenter`, {
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


