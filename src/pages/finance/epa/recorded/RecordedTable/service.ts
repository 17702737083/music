import { request } from "umi";
import { epaServiceUrl } from "@/components/OA/serviceUrl";



/**
 * 已入账 回退
 * @param formId 
 * @returns 
 */
 export async function changeSaSummonsNAndState(formId: string) {
    return request(`${epaServiceUrl}/summons/changeSaSummonsNAndState`, {
      method: "POST",
      params: { formId: formId},
    });
  }