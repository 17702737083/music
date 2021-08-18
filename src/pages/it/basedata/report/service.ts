
import { request } from "umi";  
import type { TableListItem } from './data';
import { itskillServiceUrl } from "@/components/OA/serviceUrl"; 


export async function basecountdata(params:any) { 
  console.log("query", params);
  return request(`${itskillServiceUrl}/view/selectAll`, {
    data:params,
    method: 'POST'
  }).then((res: any) => { 
    console.log("------- call url-----------") 
    return res;
  });
}  

export async function dynamicquery(params:any) { 
  console.log("query", params);
  return request(`${itskillServiceUrl}/view/selectByConditon`, {
    data:params,
    method: 'POST'
  }).then((res: any) => { 
    console.log("------- call url-----------") 
    return res;
  });
}  
  
 