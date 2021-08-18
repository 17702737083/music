import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { PlantSource } from "../../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllPlant(sysPlant: PlantSource) {
  return request(`${epaServiceUrl}/baseData/findAllPlant`, {
    method: "POST",
    data: sysPlant,
  });
}
/**
 * 保存单行
 * @param sysPlant 
 * @returns 
 */
export async function savePlant(sysPlant: PlantSource) {
  return request(`${epaServiceUrl}/baseData/savePlant`, {
    method: "POST",
    data: sysPlant,
  });
}

/**
 * 保存所有
 * @param sysPlant 
 * @returns 
 */
 export async function saveAllPlant(sysPlants: PlantSource[]) {
  return request(`${epaServiceUrl}/baseData/saveAllPlant`, {
    method: "POST",
    data: sysPlants,
  });
}

/**
 * 下载模板
 * @param params 
 * @returns 
 */
 export async function baseDownloadTemplatePlant(type?: string) {
  return request(`${epaServiceUrl}/baseData/downTemplatePlant`, {
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


