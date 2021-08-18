import { List } from "lodash";
import { request } from "umi";
import {PrintApplyParams, SysPrintApply, CompanyData, DataSourceType} from './data';
import { examineServiceUrl } from "@/components/OA/serviceUrl";


/**
 * 提交借项清单
 * @param debitNote 借项清单
 * @returns 
 */

 export async function savePrintApply(list: List) {
    return request<SysPrintApply>(`${examineServiceUrl}/print/saveData`, {
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
    return request(`${examineServiceUrl}/print/initForm`, {
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
    return request(`${examineServiceUrl}/print/changeState`, {
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
    return request(`${examineServiceUrl}/print/changeFlag`, {
      method: "POST",
      params: { referenceId: referenceId,state: state,comment: comment},
    });
}