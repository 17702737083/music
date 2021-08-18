import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { CompanySource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllCompany(sysCompany: CompanySource) {
  return request(`${epaServiceUrl}/baseData/findAllCompany`, {
    method: "POST",
    data: sysCompany,
  });
}
/**
 * 保存单行
 * @param sysCompany 
 * @returns 
 */
export async function saveCompany(sysCompany: CompanySource) {
  return request(`${epaServiceUrl}/baseData/saveCompany`, {
    method: "POST",
    data: sysCompany,
  });
}

/**
 * 保存所有
 * @param sysCompany 
 * @returns 
 */
 export async function saveAllCompany(sysCompanys: CompanySource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCompany`, {
    method: "POST",
    data: sysCompanys,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateCompany(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCompany`, {
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


