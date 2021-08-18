import request from "umi-request";
import { epaServiceUrl } from "@/components/OA/serviceUrl";
import { EstimateApportionMainSource } from "../data";

/**
 * 查询所有
 * @returns 
 */
export async function findAllEstimateApportionMain(epaEstimateApportionMain: EstimateApportionMainSource) {
  return request(`${epaServiceUrl}/costEa/findAllEpaEstimateApportionMain`, {
    method: "POST",
    data: epaEstimateApportionMain,
  });
}





