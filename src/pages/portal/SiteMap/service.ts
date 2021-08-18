import { coreSystemServiceUrl } from "@/components/OA/serviceUrl";
import { request } from "umi";

//  var coreSystemServiceUrl='http://localhost:8080'
export  function getCategorylist() {
  return request(`${coreSystemServiceUrl}/SystemLink/getCategorylist`, {
    method: "Get"
  });
}
export  function getSiteMap() {
    return request(`${coreSystemServiceUrl}/SystemLink/getSiteMap`, {
      method: "Get"
    });
  }
export  function getMyFavouriteLink() {
    return request(`${coreSystemServiceUrl}/SystemLink/getMyFavouriteLink`, {
      method: "Get"
    });
}
export  function getMyfavouriteCategory() {
    return request(`${coreSystemServiceUrl}/SystemLink/getMyfavouriteCategory`, {
      method: "Get"
    });
}
export  function getMyFavSubCategoryName() {
  return request(`${coreSystemServiceUrl}/SystemLink/getMyFavSubCategoryName`, {
    method: "Get"
  });
}
export  function addMyFav(id:number) {
  return request(`${coreSystemServiceUrl}/SysMyFavouriteLink/addMyFav/`+id, {
    method: "Get"
  });
}
export  function deleteByLinkId(linkid:number) {
  return request(`${coreSystemServiceUrl}/SysMyFavouriteLink/deleteByLinkId/`+linkid, {
    method: "Get"
  });
}
export  function findCategoryNameByNameLike(content:string) {
  return request(`${coreSystemServiceUrl}/SystemLink/findCategoryNameByNameLike`, {
    method: "Get",
    params:{"content":content}
  });
}export  function findCategoryByNameLike(content:string) {
  return request(`${coreSystemServiceUrl}/SystemLink/findCategoryByNameLike`, {
    method: "Get",
    params:{"content":content}
  });
}  