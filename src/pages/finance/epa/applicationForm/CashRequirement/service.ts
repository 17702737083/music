import { stringify } from "qs"
import { request } from "umi";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { invoiceParam } from "../../data";

/**
 * 保存表单
 * @param params 
 * @returns 
 */
export async function saveCashRequirement(body: { list: any }, options?: { [key: string]: any }) {
  return request(`${epaServiceUrl}/cash/saveCashRequirement`, {
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
 * 根据 公司别、费用类别、费用项目、创建人工号获取预估单信息
 * @param companyAlias 公司别
 * @param costAlias  费用类别
 * @param costProject 费用项目
 * @param crdateBy  创建人工号
 * @returns 
 */
export async function findAllByCrdateBy(companyAlias: string, costAlias: string, costProject: string, crdateBy: string) {
  return request(`${epaServiceUrl}/costEa/findAllByCrdateBy`, {
    method: "POST",
    params: { companyAlias: companyAlias, costAlias: costAlias, costProject: costProject, crdateBy: crdateBy },
  });
}
/**
 * 根据发票最晚日期和paymentTerm   获取付款日期
 * @param date 发票最晚日期
 * @param paymentTerm 
 * @returns 
 */
export async function getPaymentDate(date: string, paymentTerm: string) {
  return request(`${epaServiceUrl}/cash/getPaymentDate`, {
    method: "POST",
    params: { date: date, paymentTerm: paymentTerm },
  });
}
/**
 * 根据预估单号获取  剩余金额
 * @param formIds 
 * @returns 
 */
export async function getBalance(formIds: string) {
  return request(`${epaServiceUrl}/cash/getBalance`, {
    method: "POST",
    params: { formIds: formIds },
  });
}

/**
 * 初始化单据
 * @param formId 
 * @returns 
 */
export async function initForms(formId: string) {
  return request(`${epaServiceUrl}/cash/initForm`, {
    method: "POST",
    params: { formId: formId },
  });

}

/**
 * 改变单据状态哦
 * @param formId 
 * @param state 
 * @returns 
 */
export async function changeCashState(formId: string, state: string, crdateBy: string) {
  return request(`${epaServiceUrl}/cash/changeCashState`, {
    method: "POST",
    params: { formId: formId, state: state, crdateBy: crdateBy },
  });
}
/**
 * 生成签核流程
 * @param formId 
 * @returns 
 */
export async function createSignFlow(formId: string) {
  return request(`${epaServiceUrl}/signEpa/createSignFlow`, {
    method: "POST",
    params: { formId: formId },
  });
}
/**
 * 根据预估单号获取  总金额
 * @param formIds 
 * @returns 
 */
export async function getTotalMoney(formIds: string) {
  return request(`${epaServiceUrl}/cash/getTotalMoney`, {
    method: "POST",
    params: { formIds: formIds },
  });
}

/**
 * 根据币别获取  对RMB的汇率
 * @param ccurfrom 
 * @returns 
 */
export async function findCcurrateByCcurfrom(ccurfrom: string) {
  return request(`${epaServiceUrl}/dataV/findCcurrateByCcurfrom`, {
    method: "POST",
    params: { ccurfrom: ccurfrom },
  });
}

/**
 * 摘要规则+
 * @param companyCode 
 * @param costAlias 
 * @param costProject 
 * @returns 
 */
export async function getSummaryRule(companyCode: string, costAlias: string, costProject: string) {
  return request(`${epaServiceUrl}/dataV/getSummaryRule`, {
    method: "POST",
    params: { companyCode: companyCode, costAlias: costAlias, costProject: costProject },
  });
}

/**
 * 获取必填规则
 * @param companyCode 
 * @param costAlias 
 * @param costProject 
 * @returns 
 */
export async function getCostRule(companyCode: string, costAlias: string, costProject: string) {
  return request(`${epaServiceUrl}/dataV/getCostRule`, {
    method: "POST",
    params: { companyCode: companyCode, costAlias: costAlias, costProject: costProject },
  });
}
const invoicePoolUrl="https://autopaq.wistron.com";
const token = "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDQTVCOTNERjA5QzQ2NkYwNzY4REFCNjhFMUMxQTFDIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2Mjc5NjI4NjksImV4cCI6MTc1NDEwNjg2OSwiaXNzIjoiaHR0cHM6Ly9hdXRocXd0Lndpc3Ryb24uY29tL2F1dGgiLCJjbGllbnRfaWQiOiJhdXRvcGEiLCJzdWIiOiJaMTIwODMwNTAiLCJhdXRoX3RpbWUiOjE2Mjc5NTkwNjUsImlkcCI6ImxvY2FsIiwibmFtZSI6IkJ1cm5pbmcgR3UiLCJlbWFpbCI6IkJ1cm5pbmdfR3VAd2lzdHJvbi5jb20iLCJyb2xlIjoiYWRtaW4iLCJsb2NhdGlvbiI6IkExMyIsImFjdF9zdWIiOiIiLCJqdGkiOiI0MkNDM0NFNjMxNzgwMDUzNjUzQTNDMDUyMTgyNkJBRSIsInNpZCI6IjI0Rjc0RjhBRDExQ0NERDUwNzEzMjE1QTI4MzYxOEQ4IiwiaWF0IjoxNjI3OTYyODY5LCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiYXBpMSIsImVtYWlsIl0sImFtciI6WyJwd2QiXX0.cG03Moe-6Zl4h-SsfLRQeVeYccCdyQpiNoh-TJduYrt14h0rR7DqoX4MGtdOTVMM8uSQZjqTrNmTgwPbuYcm6NYZbMMmBr0e-RT5T2X6cn03y846NpSx3egwdMuh8TolzaaVtdq1imuSoEQG5scw8fJ10U1jnGFFv-d8Y21yn4Dik_hNcfYtf-UvuP1CSOrNE4uwHhYwgJ97xTo9w9MJy3KMUTTwqCTUu5XOoPW__LSKDaRDuAHNFC3s2v9riQFHM_31JQvE6BJNSeWOcCcfxc-UROXvsThRXyksWYODJJ8nE-OpOje8-xAMTFu1s55eTkSB2E8FfPrp6AtfnUfFlg";
/**
 * 保存表单
 * @param params 
 * @returns 
 */
export async function getInvoiceList(body: invoiceParam, options?: { [key: string]: any }) {
  return request(`${invoicePoolUrl}/api/InvoicePool/Invoices`, {
    method: "POST",
    headers: {
      'Content-Type':'application/json',
      // 'Accept': 'application/json',
      "Authorization": `${token}`,
    },
    ...(options || {}),
    paramsSerializer: (body: any) => stringify(body),
    data: body,
  })
}


/**
 * 汇总费用分摊明细  ，并生成差异明细
 * @param body 
 * @param options 
 * @returns 
 */
export  function getDifferenceDetail(body: { data:any }, options?: { [key: string]: any }) {
  return request(`${epaServiceUrl}/cash/getDifferenceDetail`, {
    method: "POST",
    data: body,
    // params: body,
    ...(options || {}),
    paramsSerializer: (body: any) => stringify(body)

  });
}