import { Result, OAList, SysDictDetail, SysDictHead } from "@/data";
import { request } from "umi";
import { coreSystemServiceUrl } from "@/components/OA/serviceUrl";

/**
 * 根据head获取数据字典清单.
 * @param sysDictHead SysDictHead
 * @returns SysDictDetail[]
 */
export async function queryDictDetail(dictKey: string) {
  return request<Result<OAList<SysDictDetail[]>>>(`${coreSystemServiceUrl}/dictDetail`, {
    method: "GET",
    params: { dictKey: dictKey },
  });
}



/**
 * 根据head获取数据字典清单.
 * @params sysDictHead SysDictHead
 * @returns SysDictDetail[]
 */
export async function queryDictHead() {
  return request<Result<OAList<SysDictHead[]>>>(`${coreSystemServiceUrl}/dictHead`, {
    method: "GET",
  });
}

/**
 * 保存字典
 * @param dictDetail 字典
 * @returns
 */
export async function saveDictDetail(dictDetail: SysDictDetail) {
  return request<Result<SysDictDetail>>(
    `${coreSystemServiceUrl}/dictDetail/save`,
    {
      method: "POST",
      data: dictDetail,
    }
  );
}
/**
 * 删除字典
 * @param dictDetail 字典
 * @returns
 */
export async function deleteDictDetail(dictDetail: SysDictDetail) {
  return request<Result<SysDictDetail>>(
    `${coreSystemServiceUrl}/dictDetail/delete`,
    {
      method: "POST",
      data: dictDetail,
    }
  );
}
