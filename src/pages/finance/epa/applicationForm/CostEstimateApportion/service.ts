import { stringify } from "qs"
import { request } from "umi";
import { epaServiceUrl } from "@/components/OA/serviceUrl";

/**
 * 保存表单
 * @param params 
 * @returns 
 */


export async function saveCostEstimateApportionForm(body: { list: any }, options?: { [key: string]: any }) {
  return request(`${epaServiceUrl}/costEa/saveCostApplyFor`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    // params: body,
    ...(options || {}),
    paramsSerializer: (body) => stringify(body)
  });
}


/**
 * 送签
 * @param formId 
 * @returns 
 */
export async function toSignOff(formId: string) {
  return request(`${epaServiceUrl}/costEa/toSignOff`, {
    method: "POST",
    params: { formId: formId },

  });

}

/**
 * 查询当前公司别下面是否存在此部门
 * @param deptid 
 * @param par1 
 * @param par2 
 * @returns 
 */
export  function findDept(deptid: string, par1: string, par2: string) {
   return request(`${epaServiceUrl}/costEa/findDept`, {
    method: "POST",
    params: { deptid: deptid, par1: par1, par2: par2 },

  })
}
/**
 * 查询当前公司别下面是否存在此部门 (课级，部级 costCenter  )
 * @param deptid 
 * @param sapCompanyCode 
 * @returns 
 */
export  function findDept2(deptid: string, sapCompanyCode: string) {
  return request(`${epaServiceUrl}/costEa/findDept2`, {
   method: "POST",
   params: { deptid: deptid, sapCompanyCode: sapCompanyCode},

 })
}

export  function detailedSummary(body: { data:any }, options?: { [key: string]: any }) {
  return request(`${epaServiceUrl}/costEa/detailedSummary`, {
    method: "POST",
    data: body,
    // params: body,
    ...(options || {}),
    paramsSerializer: (body: any) => stringify(body)

  });
}

/**
 * 单据作废
 * @param formId 
 * @returns 
 */    
export async function cancellation(formId: string) {
  return request(`${epaServiceUrl}/costEa/cancellation`, {
    method: "POST",
    params: { formId: formId },
  });

}  
/**
 * 初始化单据
 * @param formId 
 * @returns 
 */
export async function initForms(formId: string) {
  return request(`${epaServiceUrl}/costEa/initForm`, {
    method: "POST",
    params: { formId: formId },
  });
} 
/**
 * 下载模板
 * @param params 
 * @returns 
 */
export async function downloadTemplate(index?: string) {
  console.log("=======params=========", index)
  return request(`${epaServiceUrl}/download/downloadTemplateToDetail`, {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
      },
      params: {index:index},
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
 * 改变单据状态哦
 * @param formId 
 * @param state 
 * @returns 
 */   
 export async function changeState(formId: string,state:string,crdateBy:string) {
  return request(`${epaServiceUrl}/costEa/changeState`, {
    method: "POST",
    params: { formId: formId, state:state, crdateBy:crdateBy},
  });
} 

/**
 * 查询区域List
 * @param companyCode 
 * @returns 
 */   
 export async function findAreaList(companyCode: string) {
  return request(`${epaServiceUrl}/dataV/findAreaList`, {
    method: "POST",
    params: { companyCode: companyCode},
  });
}

/**
 * 查询必填规则 List
 * @param companyCode 
 * @returns 
 */   
 export async function findCostRuleList(type: string,companyCode: string) {
  return request(`${epaServiceUrl}/dataV/findCostRuleList`, {
    method: "POST",
    params: {type:type,companyCode: companyCode},
  });
}

/**
 * 查询摘要规则List
 * @param companyCode 
 * @returns 
 */   
 export async function findSummaryRuleList(companyCode: string) {
  return request(`${epaServiceUrl}/dataV/findSummaryRuleList`, {
    method: "POST",
    params: { companyCode: companyCode},
  });
}

/**
 * 查询摘要规则List
 * @param companyCode 
 * @returns 
 */   
 export async function changeFinanceSign(formId: string) {
  return request(`${epaServiceUrl}/signEpa/changeFinanceSign`, {
    method: "POST",
    params: { formId: formId},
  });
}
