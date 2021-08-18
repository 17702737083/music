import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";

/**
 * 查询登录user基础资料权限
 * @returns 
 */
export async function getUserAuth(empId: string) {
  return request(`${epaServiceUrl}/user/getUserAuth`, {
    method: "POST",
    params: {empId:empId},
  });
}



