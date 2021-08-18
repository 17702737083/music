import { request } from 'umi';
import type { TableListItem } from './data';
import { itskillServiceUrl } from "@/components/OA/serviceUrl"; 
export async function dynamicquery(params?: TableListItem) { 
  return request(`${itskillServiceUrl}/count/all`, {
    params,
    method: 'POST'
  }).then(res => { 
    let data=[]
    res.forEach(e => {
      data.push(e)
    });
    res={data:data}
    return res;
  });
}  
  