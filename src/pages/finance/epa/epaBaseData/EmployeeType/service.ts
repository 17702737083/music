import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { EmployeeTypeSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllEmployeeType(sysEmployeeType: EmployeeTypeSource) {
  return request(`${epaServiceUrl}/baseData/findAllEmployeeType`, {
    method: "POST",
    data: sysEmployeeType,
  });
}
/**
 * 保存单行
 * @param sysEmployeeType 
 * @returns 
 */
export async function saveEmployeeType(sysEmployeeType: EmployeeTypeSource) {
  return request(`${epaServiceUrl}/baseData/saveEmployeeType`, {
    method: "POST",
    data: sysEmployeeType,
  });
}

/**
 * 保存所有
 * @param sysEmployeeType 
 * @returns 
 */
 export async function saveAllEmployeeType(sysEmployeeTypes: EmployeeTypeSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllEmployeeType`, {
    method: "POST",
    data: sysEmployeeTypes,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateEmployeeType(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateEmployeeType`, {
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


