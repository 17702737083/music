import { request } from "umi";
import { coreSignServiceUrl, epaServiceUrl } from "@/components/OA/serviceUrl";
import { SaSummonSource } from "../../data";



/**
 * 待入账（）
 * @param flag (Y为已确认，N为未确认)
 * @param crdateBy 
 * @returns 
 */
export async function toInputAccount(state: string,flag: string, crdateBy: string) {
  return request(`${epaServiceUrl}/costEa/inputAccount`, {
    method: "POST",
    params: { state: state,flag: flag, crdateBy: crdateBy },

  });
}
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
 * 确认传票
 * @param epaSaSummons 
 * @returns 
 */
 export async function affirmSaSummons(epaSaSummons: SaSummonSource[]) {
  return request(`${epaServiceUrl}/summons/affirmSaSummons`, {
    method: "POST",
    data: epaSaSummons,
  });
}

/**
 * 回退签核记录
 * @param referenceId 单号
 * @param actualSignEmployeeId 登录人工号（签核人/Return人工号）
 * @returns 
 */
 export async function returnFinanceSign(referenceId: string, actualSignEmployeeId: string) {
  return request(`${coreSignServiceUrl}/returnFinanceSign`, {
    method: "POST",
    params: { referenceId: referenceId, actualSignEmployeeId: actualSignEmployeeId },
  });
}

/**
 * 回退传票
 * @param formId 
 * @returns 
 */
 export async function rollbackSaSummons(formId: string, actualSignEmployeeId: string ) {
  return request(`${epaServiceUrl}/summons/rollbackSaSummons`, {
    method: "POST",
    params: { formId: formId,crdateBy:actualSignEmployeeId},
  });
}
/**
 * 确认传票
 * @param epaSaSummons 
 * @returns 
 */
 export async function saveSimpleSummon(epaSaSummons: SaSummonSource) {
  return request(`${epaServiceUrl}/summons/saveSimpleSummon`, {
    method: "POST",
    data: epaSaSummons,
  });
}
/**
 * 查看分录costCenter是否存在
 * @param costCtr 
 * @returns 
 */
 export async function findByCostCtr(costCtr: string) {
  return request(`${epaServiceUrl}/summons/findByCostCtr`, {
    method: "POST",
    params: { costCtr: costCtr},
  });
}

