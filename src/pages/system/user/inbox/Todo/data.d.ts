export type SignHeadDTO = {
  referenceId?: string;
  callBackUrl?: string;
  context?: string;
  item?: string;
  subCategory?: string;
  category?: string;
  createBy?: string;
  createTime?: string;
  cname?: string;
  ename?: string;
  deptid?: string;
  deptn?: string;
};

export type  CategoryData= {
  key?: string;
  title?: string;
  value?: number;
  total?: boolean;
  status?:string;
};
