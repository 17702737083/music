// @ts-ignore
/* eslint-disable */
import { FakeCaptcha, LoginParams, LoginState, Result } from "@/data";
import { request } from "umi";
import { coreSystemServiceUrl } from "@/components/OA/serviceUrl";

/** 发送验证码 POST /login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any }
) {
  return request<FakeCaptcha>(`${coreSystemServiceUrl}/login/captcha`, {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登录接口 POST /login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>(
    `${coreSystemServiceUrl}/login/outLogin`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** 登录接口 POST /login/account */
export async function login(
  body: LoginParams,
  options?: { [key: string]: any }
) {
  return request<Result<LoginState>>(`${coreSystemServiceUrl}/login/account`, {
    method: "POST",
    data: body,
    ...(options || {}),
  });
}
