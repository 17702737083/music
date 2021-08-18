import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { CurrencySource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllCurrency(sysCurrency: CurrencySource) {
  return request(`${epaServiceUrl}/baseData/findAllCurrency`, {
    method: "POST",
    data: sysCurrency,
  });
}
/**
 * 保存单行
 * @param sysCurrency 
 * @returns 
 */
export async function saveCurrency(sysCurrency: CurrencySource) {
  return request(`${epaServiceUrl}/baseData/saveCurrency`, {
    method: "POST",
    data: sysCurrency,
  });
}

/**
 * 保存所有
 * @param sysCurrency 
 * @returns 
 */
 export async function saveAllCurrency(sysCurrencys: CurrencySource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllCurrency`, {
    method: "POST",
    data: sysCurrencys,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateCurrency(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateCurrency`, {
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


