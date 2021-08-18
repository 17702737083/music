import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { AreaSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllArea(empId:string,sysArea: AreaSource) {
  return request(`${epaServiceUrl}/baseData/findAllArea`, {
    method: "POST",
    params:{empId:empId},
    data: sysArea,
  });
}
/**
 * 保存单行
 * @param sysArea 
 * @returns 
 */
export async function saveArea(sysArea: AreaSource) {
  return request(`${epaServiceUrl}/baseData/saveArea`, {
    method: "POST",
    data: sysArea,
  });
}

/**
 * 保存所有
 * @param sysArea 
 * @returns 
 */
 export async function saveAllArea(type:string,sysAreas: AreaSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllArea`, {
    method: "POST",
    params:{type:type},
    data: sysAreas,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateArea(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateArea`, {
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


