import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { CostCenterSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllCostCenter(empId:string,sysCostCenter: CostCenterSource) {
  return request(`${epaServiceUrl}/baseData/findAllCostCenter`, {
    method: "POST",
    params:{empId:empId},
    data: sysCostCenter,
  });
}
/**
 * 保存单行
 * @param sysCostCenter 
 * @returns 
 */
export async function saveCostCenter(sysCostCenter: CostCenterSource) {
  return request(`${epaServiceUrl}/baseData/saveCostCenter`, {
    method: "POST",
    data: sysCostCenter,
  });
}

/**
 * 保存所有
 * @param sysCostCenter 
 * @returns 
 */
 export async function saveAllCostCenter(type:string,sysCostCenters: CostCenterSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCostCenter`, {
    method: "POST",
    params:{type:type},
    data: sysCostCenters,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateCostCenter(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCostCenter`, {
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


