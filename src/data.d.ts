// @ts-ignore
/* eslint-disable */
export type CurrentUser = {
  name?: string;
  avatar?: string;
  email?: string;
  signature?: string;
  title?: string;
  group?: string;
  tags?: { key?: string; label?: string }[];
  notifyCount?: number;
  unreadCount?: number;
  country?: string;
  access?: string;
  geographic?: {
    province?: { label?: string; key?: string };
    city?: { label?: string; key?: string };
  };
  address?: string;
  phone?: string;
  employeeInfoDTO?: EmployeeInfo;
  orgInfoDTO?: OrgInfo;
};

export type PageParams = {
  pageSize: number;
  current: number;
};

export type Result<T extends OAList | {}> = {
  success?: boolean;
  data?: T;
  errorCode?: number;
  errorMessage?: string;
  showType?: string;
  traceId?: string;
  host?: string;
};

export type OAList<T extends unknown[]> = {
  content?: T;
  list?: T;
  current?: number;
  pageSize?: number;
  totalElements?: number;
};

export type LoginState = {
  status?: string;
  type?: string;
  token?: string;
};

export type PageParams = {
  current?: number;
  pageSize?: number;
};

export type FakeCaptcha = {
  code?: number;
  status?: string;
};

export type LoginParams = {
  username?: string;
  password?: string;
  autoLogin?: boolean;
  type?: string;
};

export type ErrorResponse = {
  /** 业务约定的错误码 */
  errorCode: string;
  /** 业务上的错误信息 */
  errorMessage?: string;
  /** 业务上的请求是否成功 */
  success?: boolean;
};

export type NoticeIconList = {
  data?: NoticeIconItem[];
  /** 列表的内容总数 */
  total?: number;
  success?: boolean;
};

export type NoticeIconItemType = "notification" | "message" | "event";

export type NoticeIconItem = {
  id?: string;
  extra?: string;
  key?: string;
  read?: boolean;
  avatar?: string;
  title?: string;
  status?: string;
  datetime?: string;
  description?: string;
  type?: NoticeIconItemType;
};

export type SysDictHead = {
  /**
   * id
   */
  id?: number;
  /**
   * service名称
   */
  dictServiceKey: string;
  dictServiceName?: string | undefined;
  /**
   * 字典群组
   */
  dictGroupKey: string;
  dictGroupName?: string;
  /**
   * 字典key
   */
  dictKey: string;
  /**
   * 字典标签
   */
  dictKeyName?: string;

  sysDictDetailList?: SysDictDetail[];
};

export type SysDictDetail = {
  id?: number;
  dictKey?: string;
  dictValue?: string;
  dictValueSort?: number;
  dictValueLabel?: string;
  isDefault?: number;
  [string?]: any;
};

export type EmployeeInfo = {
  emplid?: string;
  cname?: string;
  ename?: string;
  plant?: string;
  mail?: string;
  deptid?: string;
  upperDept?: string;
  emplCategory?: string;
  supervisor?: string;
  officerLevel?: string;
  cardid?: string;
  company?: string;
  deptn?: string;
  hdate?: string;
  descrshort?: string;
  phone?: string;
  udate?: string;
  sex?: string;
  jobcode?: string;
  uinSgp?: string;
  birthdate?: Date;
  marStatus?: string;
  localFlaga?: string;
  salLocationa?: string;
  eduDegree?: string;
  education?: string;
};

export type OrgInfo = {
  deptid?: string;
  descr?: string;
  descrA?: string;
  managerId?: string;
  treeLevelNum?: string;
  uporgCodea?: string;
  company?: string;
  planIdA?: string;
  location?: string;
  salLocationa?: string;
  udate?: Date;
  sectioncode?: string;
  dept?: string;
  plant?: string;
  plantcode?: string;
  gmcode?: string;
};
