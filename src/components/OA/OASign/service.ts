import { OAList, Result } from "@/data";
import { request } from "umi";
import { SignRecordDTO } from "./data";
import {
  coreSignServiceUrl,
} from "@/components/OA/serviceUrl";

export async function getSignRecordListByReferenceId(referenceId: string) {
  return request<Result<OAList<SignRecordDTO[]>>>(
    `${coreSignServiceUrl}/getSignRecordListByReferenceId`,
    {
      method: "POST",
      params: { referenceId: referenceId },
    }
  );
}

export async function generateSignRecordListByDictKey(
  dictKey: string,
  referenceId?: string,
  callBackUrl?: string,
  category?: string,
  subCategory?: string,
  item?: string
) {
  return request<Result<OAList<SignRecordDTO[]>>>(
    `${coreSignServiceUrl}/generateSignRecordListByDictKey`,
    {
      method: "POST",
      params: {
        dictKey: dictKey,
        referenceId: referenceId,
        callBackUrl: callBackUrl,
        category: category,
        subCategory: subCategory,
        item: item,
      },
    }
  );
}

export async function approve(
  referenceId?: string,
  comment?: string | undefined
) {
  // return request<Result<OAList<SignRecordDTO[]>>>(`${apiBaseUrl}/approve`, {
  //   method: "POST",
  //   params: { referenceId: referenceId, comment: comment },
  // });

  return request<Result<OAList<SignRecordDTO[]>>>(
    `${coreSignServiceUrl}/approve`,
    {
      method: "POST",
      params: { referenceId: referenceId, comment: comment },
    }
  );
}

export async function reject(
  referenceId?: string,
  comment?: string | undefined
) {
  return request<Result<OAList<SignRecordDTO[]>>>(
    `${coreSignServiceUrl}/reject`,
    {
      method: "POST",
      params: { referenceId: referenceId, comment: comment },
    }
  );
}
