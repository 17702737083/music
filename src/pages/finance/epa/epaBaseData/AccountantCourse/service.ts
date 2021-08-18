import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { AccountantCourseSourceType } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllAccountantCourse(sysAccountantCourse: AccountantCourseSourceType) {
  return request(`${epaServiceUrl}/baseData/findAllAccountantCourse`, {
    method: "POST",
    data: sysAccountantCourse,
  });
}
/**
 * 保存单行
 * @param sysAccountantCourse 
 * @returns 
 */
export async function saveAccountantCourse(sysAccountantCourse: AccountantCourseSourceType) {
  return request(`${epaServiceUrl}/baseData/saveAccountantCourse`, {
    method: "POST",
    data: sysAccountantCourse,
  });
}

/**
 * 保存所有
 * @param sysAccountantCourses 
 * @returns 
 */
 export async function saveAllAccountantCourse(sysAccountantCourses: AccountantCourseSourceType[]) {
  return request(`${epaServiceUrl}/baseData/saveAllAccountantCourse`, {
    method: "POST",
    data: sysAccountantCourses,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function downTemplateAccountantCourse(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateAccountantCourse`, {
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


