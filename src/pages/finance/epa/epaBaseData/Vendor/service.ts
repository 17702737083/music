import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { VendorSourceType } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllVendor(empId:string,sysVendor: VendorSourceType) {
  return request(`${epaServiceUrl}/baseData/findAllVendor`, {
    method: "POST",
    params:{empId:empId},
    data: sysVendor,
  });
}
/**
 * 保存单行
 * @param sysVendor 
 * @returns 
 */
export async function saveVendor(sysVendor: VendorSourceType) {
  return request(`${epaServiceUrl}/baseData/saveVendor`, {
    method: "POST",
    data: sysVendor,
  });
}

/**
 * 保存所有
 * @param sysVendor 
 * @returns 
 */
 export async function saveAllVendor(type:string,sysVendors: VendorSourceType[]) {
  return request(`${epaServiceUrl}/baseData/saveAllVendor`, {
    method: "POST",
    params:{type:type},
    data: sysVendors,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateVendor(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateVendor`, {
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


