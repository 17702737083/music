import { request } from 'umi';
import type { TableListParams, TableListItem } from './data';

export async function releaseXuqian(params?: TableListItem) {
  console.log("query", params);
  //192.168.66.57,localhost
  return request('http://192.168.66.57:8015/xuqian/releaseXuqian', {
    data: params,
    method: 'POST'
  }).then(res => {
    console.log(params);
    res.data = res.dataList;
    return res;
  });
} 

export async function releaseqiancheng1(params?: TableListItem) {
  console.log("query", params);
  return request('http://192.168.66.57:8015/xuqian/test', {
    data: params,
    method: 'POST'
  }).then(res => {
    console.log(params);
    res.data = res.data;
    return res;
  });
}  
export async function releaseqiancheng(params?: TableListItem) {
  console.log("query", params);
  return request('http://192.168.66.57:8015/xuqian/releaseqiancheng', {
    data: params,
    method: 'POST'
  }).then(res => {
    console.log(params);
    res.data = res.dataList;
    return res;
  });
}  
export async function dynamicquery(params?: TableListItem) {
  console.log("query", params);
  return request('http://192.168.66.57:8015/xuqian/selxuqianList', {
    params,
    method: 'POST'
  }).then(res => {
    //console.log(res.dataList);
    res.data = res.dataList2;
    return res;
  });
} 
export async function downloadtemplate(params?: TableListParams) {
  console.log("start download", params);
  request("http://192.168.66.57:8015/xuqian/downloadtemplate", {
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
 
export async function exportXuqian(params?: TableListItem) {
  console.log("start download", params);
  request("http://192.168.66.57:8015/xuqian/exportXuqian", {
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
