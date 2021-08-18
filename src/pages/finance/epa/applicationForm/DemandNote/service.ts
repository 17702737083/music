import { request } from "umi";
import { epaServiceUrl } from "@/components/OA/serviceUrl";

 
 export async function findSelect(selectKey: string) {
  return request(`${epaServiceUrl}/select/findSelect`, {
    method: "POST",
    params: {selectKey: selectKey},
  });

} 

