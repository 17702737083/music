import { request } from "umi"; 
import { itskillServiceUrl } from "@/components/OA/serviceUrl";
 
export async function saveITbase(datas) {
  return request(`${itskillServiceUrl}/tpcn/insert/inserttpcnForm`, {
    method: "POST",
    data: datas,
  });
}
 