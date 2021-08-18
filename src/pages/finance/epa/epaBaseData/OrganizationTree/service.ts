import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { OrganizationTreeSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllOrganizationTree(sysOrganizationTree: OrganizationTreeSource) {
  return request(`${epaServiceUrl}/baseData/findAllOrganizationTree`, {
    method: "POST",
    data: sysOrganizationTree,
  });
}
/**
 * 保存单行
 * @param sysOrganizationTree 
 * @returns 
 */
export async function saveOrganizationTree(sysOrganizationTree: OrganizationTreeSource) {
  return request(`${epaServiceUrl}/baseData/saveOrganizationTree`, {
    method: "POST",
    data: sysOrganizationTree,
  });
}

/**
 * 保存所有
 * @param sysOrganizationTrees 
 * @returns 
 */
 export async function saveAllOrganizationTree(sysOrganizationTrees: OrganizationTreeSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllOrganizationTree`, {
    method: "POST",
    data: sysOrganizationTrees,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function downTemplateOrganizationTree(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateOrganizationTree`, {
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


