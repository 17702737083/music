import { epaServiceUrl } from "@/components/OA/serviceUrl";
import request from "umi-request";
import { CostAccountantCourseSource } from "../../data";
/**
 * 查询所有
 * @returns 
 */
export async function findAllCostAccountantCourse(empId:string,sysCostAccountantCourse: CostAccountantCourseSource) {
  return request(`${epaServiceUrl}/baseData/findAllCostAccountantCourse`, {
    method: "POST",
    params:{empId:empId},
    data: sysCostAccountantCourse,
  });
}
/**
 * 保存单行
 * @param sysCostAccountantCourse 
 * @returns 
 */
export async function saveCostAccountantCourse(sysCostAccountantCourse: CostAccountantCourseSource) {
  return request(`${epaServiceUrl}/baseData/saveCostAccountantCourse`, {
    method: "POST",
    data: sysCostAccountantCourse,
  });
}

/**
 * 保存所有
 * @param sysCostAccountantCourses 
 * @returns 
 */
 export async function saveAllCostAccountantCourse(type:string,sysEpaCostAccountantCourses: CostAccountantCourseSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCostAccountantCourse`, {
    method: "POST",
    params:{type:type},
    data: sysEpaCostAccountantCourses,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function downTemplateCostAccountantCourse(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCostAccountantCourse`, {
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
/**
 * 提示与费用类别相关的基础资料维护
 * @param companyCode 
 * @param costAlias 
 * @param costProject 
 * @returns 
 */
 export async function hintCostAbout(companyCode: string,costAlias: string,costProject: string) {
  return request(`${epaServiceUrl}/baseData/hintCostAbout`, {
    method: "POST",
    params: { companyCode: companyCode ,costAlias: costAlias ,costProject: costProject },
  });
} 



