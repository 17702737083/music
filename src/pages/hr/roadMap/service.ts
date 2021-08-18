import { request } from "umi";
import { DetailReq } from "./data";

var rodemapurl='http://10.66.20.100:8013'

export  function getfunctioncover() {
  return request(`${rodemapurl}/homecontroller/getfunctioncover`, {
    method: "Get"
  });
}

export  function getoverrate() {
    return request(`${rodemapurl}/homecontroller/getoverrate`, {
      method: "Get"
    });
  }
export  function getoverratetrend() {
    return request(`${rodemapurl}/homecontroller/getoverratetrend`, {
      method: "Get"
    });
  }

export  function getvwcoursefunrate() {
    return request(`${rodemapurl}/homecontroller/getvwcoursefunrate`, {
      method: "Get"
    });
  }
 
export  function getfunctiondetail(detailReq:DetailReq) {
    return request(`${rodemapurl}/detailcontrller/getfunctiondetail`, {
      method: "Post",
      data:detailReq
    });
  } 
  