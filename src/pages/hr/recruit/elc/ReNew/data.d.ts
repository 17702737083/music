export type TableListItem = {
  uuid:string,
  deptid:string,
  emplid:string,
  emplCategory:string,
  cname:string,
  hdate:Date,
  sdate:Date,
  edate:Date,
  nofix:string,
  cdate:Date,
  cuser:string,
   mdate:Date, 
   muser:Date,
  phone:string,
  headcrtdate:Date,
  rejectdate:Date,
  approvedate:Date,
  senddate:Date,
  signdate:Date,
  finishdate:Date,
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
