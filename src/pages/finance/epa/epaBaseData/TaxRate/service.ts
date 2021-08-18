import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { TaxRateSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllTaxRate(sysTaxRate: TaxRateSource) {
  return request(`${epaServiceUrl}/baseData/findAllTaxRate`, {
    method: "POST",
    data: sysTaxRate,
  });
}
/**
 * 保存单行
 * @param sysTaxRate 
 * @returns 
 */
export async function saveTaxRate(sysTaxRate: TaxRateSource) {
  return request(`${epaServiceUrl}/baseData/saveTaxRate`, {
    method: "POST",
    data: sysTaxRate,
  });
}

/**
 * 保存所有
 * @param sysTaxRate 
 * @returns 
 */
 export async function saveAllTaxRate(sysTaxRates: TaxRateSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllTaxRate`, {
    method: "POST",
    data: sysTaxRates,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplateTaxRate(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplateTaxRate`, {
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


