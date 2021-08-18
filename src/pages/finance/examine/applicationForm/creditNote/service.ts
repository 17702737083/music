import { List } from "lodash";
import { request } from "umi";
import {CreditNoteParams, SysCreditNote, CompanyData, DataSourceType} from './data';
import { examineServiceUrl } from "@/components/OA/serviceUrl";


/**
 * 提交借项清单
 * @param debitNote 借项清单
 * @returns 
 */

 export async function saveCreditNote(list: List) {
    return request<SysCreditNote>(`${examineServiceUrl}/credit/saveData`, {
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
    return request(`${examineServiceUrl}/credit/initForm`, {
      method: "POST",
      params: { referenceId: referenceId },
    });
  
  } 
  
  /**
   * 驳回时改变单据状态
   * @param referenceId 
   * @param state 
   * @returns 
   */   
   export async function changeState(referenceId: string,comment: string) {
    return request(`${examineServiceUrl}/credit/changeState`, {
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
    return request(`${examineServiceUrl}/credit/changeFlag`, {
      method: "POST",
      params: { referenceId: referenceId,state: state,comment: comment},
    });
    
}