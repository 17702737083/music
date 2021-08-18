import { List } from "lodash";
import { request } from "umi";
import {DebitNoteParams, SysDebitNote, CompanyData, DataSourceType} from './data';
import { examineServiceUrl } from "@/components/OA/serviceUrl";

//const examineServiceUrl="http://localhost:8102";

/**
 * 提交借项清单
 * @param debitNote 借项清单
 * @returns 
 */

 export async function saveDebitNote(list: List) {
    return request<SysDebitNote>(`${examineServiceUrl}/debit/saveData`, {
      method: "POST",
      data: list,
    });
  }

  /**
 * 初始化单据
 * @param referenceId 
 * @returns 
 */
export async function initForm(referenceId: string) {
  return request(`${examineServiceUrl}/debit/initForm`, {
    method: "POST",
    params: { referenceId: referenceId },
  });

} 

  /**
 * 获取供应商名称
 * @param referenceId 
 * @returns 
 */
   export async function getVendor(vendorcode: string) {
    return request(`${examineServiceUrl}/debit/getVendor`, {
      method: "POST",
      params: { vendorcode: vendorcode },
    });
  
  } 

/**
 * 驳回时改变单据状态
 * @param referenceId 
 * @param state 
 * @returns 
 */   
 export async function changeState(referenceId: string,comment: string) {
  return request(`${examineServiceUrl}/debit/changeState`, {
    method: "POST",
    params: { referenceId: referenceId,comment: comment},
  });
}

/**
 * 签核完成时改变单据状态
 * @param referenceId 
 * @param state 
 * @returns 
 */   
 export async function changeFlag(referenceId: string,state: string,comment: string) {
  return request(`${examineServiceUrl}/debit/changeFlag`, {
    method: "POST",
    params: { referenceId: referenceId,state: state,comment: comment},
  });
}
