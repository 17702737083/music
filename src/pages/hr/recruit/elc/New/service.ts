import { request } from 'umi';
import type { TableListParams, TableListItem } from './data';




export async function downloadtemplate(params?: TableListParams) {
  console.log("start download", params);
  request("http://192.168.66.57:8015/users/downloadtemplate", {
    params,
    responseType: "blob"
  }).then(res => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(res)
    a.click()
    URL.revokeObjectURL(a.href)
    a.remove();
  });
}
export async function releaseCandidate(params?: TableListItem) {
  console.log("query", params);
  return request('http://192.168.66.57:8015/users/releaseCandidate', {
    data: params,
    method: 'POST'
  }).then(res => {
    console.log(res.dataList);
    
    // res = res.dataList;
    return res.dataList;
  });
} 
export async function dynamicquery(params?: TableListItem) {
  console.log("query", params);
  return request('http://192.168.66.57:8015/users/dynamicquery', {
    params,
    method: 'POST'
  }).then(res => {
    //console.log(res.dataList);
    res.data = res.dataList;
    return res;
  });
} 
export async function exportExcel(params?: TableListParams) {
  console.log("start download", params);
  request("http://192.168.66.57:8015/users/download", {
    params,
    responseType: "blob"
  }).then(res => {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(res)
    a.click()
    URL.revokeObjectURL(a.href)
    a.remove();
  });
}
