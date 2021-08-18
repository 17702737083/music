import { request } from "umi";
import { epaServiceUrl } from "@/components/OA/serviceUrl";



/**
 * 查看 sa 传票详情
 * @param formId 
 * @param flag 
 * @returns 
 */
export async function findSaSummons(formId: string, flag: string) {
  return request(`${epaServiceUrl}/summons/findSaSummons`, {
    method: "POST",
    params: { formId: formId, flag: flag },
  });
}

/**
 * 已确认回退
 * @param formId 
 * @returns 
 */
 export async function changeSaSummonsN(formId: string) {
  return request(`${epaServiceUrl}/summons/changeSaSummonsN`, {
    method: "POST",
    params: { formId: formId},
  });
}




