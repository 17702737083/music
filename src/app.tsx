import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { queryCurrentUser, queryCurrentUserMenu } from './pages/system/service';
import { queryDictDetail } from './pages/system/basedata/Dict/service';
import React from 'react';
import { SmileOutlined, HeartOutlined } from '@ant-design/icons';
import { CurrentUser, OAList, Result, SysDictDetail } from './data';


const loginPath = '/system/user/login';


/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};


/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  menuData?: MenuDataItem[] | undefined;
  currentUser?: CurrentUser | undefined;
  fetchUserInfo: () => Promise<Result<CurrentUser> | undefined>;
  fetchMenuInfo: () => Promise<Result<OAList<MenuDataItem[]>> | undefined>;
  fetchDictInfo: (dictKey: string) => Promise<Result<OAList<SysDictDetail[]>> | undefined>;
  getQueryString: (name: string) => string;
}> {


  const getQueryString = (name: string) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return "";
  }

  const fetchUserInfo = async () => {
    try {

      const currentUserResult = await queryCurrentUser();

      if (currentUserResult.errorCode === 0) {
        console.log(currentUserResult);
        return currentUserResult;
      } else {
        console.error("fetchUserInfo", currentUserResult);
        history.push(loginPath);
      }

    } catch (error) {
      console.error("fetchUserInfo", error);
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchMenuInfo = async () => {
    try {
      const currentUserMenuResult = await queryCurrentUserMenu();

      if (currentUserMenuResult.errorCode === 0) {
        return currentUserMenuResult;
      } else {
        console.error("fetchMenuInfo", currentUserMenuResult);
      }
    } catch (error) {
      console.error("fetchMenuInfo", error);
    }
    return undefined;
  };

  const fetchDictInfo = async (dictKey: string) => {
    try {

      const dictListResult = await queryDictDetail(dictKey);
      if (dictListResult.errorCode === 0) {
        return dictListResult;
      }
    } catch (error) {
      console.error("fetchDictInfo", error);
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {

    //获取用户信息
    const currentUserResult = await fetchUserInfo();
    //获取菜单信息
    const menuDataResult = await fetchMenuInfo();
    if (currentUserResult?.errorCode === 0 && menuDataResult?.errorCode === 0) {

      //TODO 臨時方案:含portal的頁面不需要菜單.
      if (history.location.pathname.includes("portal")) {
        return {
          fetchUserInfo,
          fetchMenuInfo,
          fetchDictInfo,
          getQueryString,
          currentUser: currentUserResult.data,
          menuData: menuDataResult.data?.list,
          //自定义布局.
          settings: {
            menuRender: false,
            footerRender: false
          },
        };
      }
      return {
        fetchUserInfo,
        fetchMenuInfo,
        fetchDictInfo,
        getQueryString,
        currentUser: currentUserResult.data,
        menuData: menuDataResult.data?.list,
        //自定义布局.
        settings: {},
      };
    }
  }


  return {
    fetchUserInfo,
    fetchMenuInfo,
    fetchDictInfo,
    getQueryString,
    settings: {
      menuRender: false,
      headerRender: false,
      footerRender: false,
    },
  };
}
const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
};

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => menus && menus.map(({ iconText, children, ...item }) => ({
  ...item,
  icon: iconText && IconMap[iconText as string],
  children: children && loopMenuItem(children),
}));

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {

  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    menuDataRender: (menuData: any) => {
      const menu = loopMenuItem(initialState?.menuData as MenuDataItem[] || menuData);
      console.log("final menu", menu);
      return menu;
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login      
      console.log("页面跳转", location.pathname, initialState);
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;

  // if (error.name == "BizError") {
  //   notification.error({
  //     message: error.message,
  //   });
  //   return;
  // }

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器' + error,
      message: '网络异常',
    });
  }
  throw error;
};

/**
 * 请求前拦截.表头加上token.
 * @param url 网址
 * @param options 配置
 * @returns 
 */
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  //gateway
  // console.log(options);
  return {
    url: `${url}`,
    options: {
      ...options,
      interceptors: true,
      headers: authHeader
    },
  };
};


const oAListConvertInterceptor = (response: Response, options: RequestOptionsInit) => {

  console.log("interceptors", response, options);
  return response;
};


// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  // errorConfig: {
  //   adaptor: (res: any) => {

  //     // debugger;
  //     if (res?.data?.content) {
  //       const rest= {
  //         ...res,
  //         data: res.data?.content,
  //         total: res?.data?.totalElements,
  //         success: res.errorCode === 0,
  //       };
  //       console.log("data converted",rest);
  //       return rest;
  //     }
  //     return res;
  //   },
  // },
  errorHandler,
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  // responseInterceptors: [oAListConvertInterceptor]
};
