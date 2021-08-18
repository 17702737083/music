import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { CustomerSourceType } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllCustomer(empId:string,sysCustomer: CustomerSourceType) {
  return request(`${epaServiceUrl}/baseData/findAllCustomer`, {
    method: "POST",
    params:{empId:empId},
    data: sysCustomer,
  });
}
/**
 * 保存单行
 * @param sysCustomer 
 * @returns 
 */
export async function saveCustomer(sysCustomer: CustomerSourceType) {
  return request(`${epaServiceUrl}/baseData/saveCustomer`, {
    method: "POST",
    data: sysCustomer,
  });
}

/**
 * 保存所有
 * @param sysCustomers 
 * @returns 
 */
 export async function saveAllCustomer(type:string,sysCustomers: CustomerSourceType[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCustomer`, {
    method: "POST",
    params:{type:type},
    data: sysCustomers,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function downTemplateCustomer(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCustomer`, {
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


