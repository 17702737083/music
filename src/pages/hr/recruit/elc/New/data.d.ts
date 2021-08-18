export type TableListItem = {
  id: string,
  name: string,
  phone: string,
  sex:string,
  nation:string,
  birthdate:string,
  idcardaddress:string,
  idnumber:string,
  age:string,
  presentaddress:string,
  schoolofgraduation:string,
  degreeofeducation:string,
  major:string,
  graduationdate:string,
  englishlevel:string,
  maritalstatus:string,
  emergencycontact:string,
  parentname:string,
  parentphone:string,
  spousename:string,
  spousephone:string,
  childrenname:string,
  childrenphone:string,
  signstate:string,
  daystodate:string,
  createdate:string,
  interviewdate:string,

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
