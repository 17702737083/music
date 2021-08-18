import { request } from "umi";
import { stringify } from "qs"
import { epaServiceUrl } from "@/components/OA/serviceUrl";



export  function findAll(body: { data: any }, options?: { [key: string]: any }) {
  return request(`${epaServiceUrl}/costEa/findAll`, {
    method: "POST",
    data: body,
    // params: body,
    ...(options || {}),
    paramsSerializer: (body: any) => stringify(body)

  });

}


