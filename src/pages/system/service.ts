// @ts-ignore
/* eslint-disable */

import { Result, CurrentUser, NoticeIconList, OAList } from "@/data";
import { MenuDataItem } from "@ant-design/pro-layout";
import { request } from "umi";
import { coreSystemServiceUrl } from "@/components/OA/serviceUrl";

/** 获取当前的用户 GET /currentUser */
export async function queryCurrentUser() {
  return request<Result<CurrentUser>>(`${coreSystemServiceUrl}/currentUser`);
}

/** 此处后端没有提供注释 GET /notices */
export async function getNotices() {
  return request<Result<NoticeIconList>>(`${coreSystemServiceUrl}/notices`);
}

/** 获取当前的用户菜单 GET /currentUser */
export async function queryCurrentUserMenu() {
  return request<Result<OAList<MenuDataItem[]>>>(`${coreSystemServiceUrl}/currentUserMenu`);
}
