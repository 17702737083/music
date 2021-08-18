import { OAList, Result } from "@/data";
import { request } from "umi";
import { SignHeadDTO } from "./data";
import { coreSignServiceUrl } from "@/components/OA/serviceUrl";

export async function toBeSigned() {
    return request<Result<OAList<SignHeadDTO[]>>>(`${coreSignServiceUrl}/toBeSigned`, {
      method: "POST",
    });
  }