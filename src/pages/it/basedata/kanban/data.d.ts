export type TableListItem = {
  id:any,
  site:any,
  dept:any,
  leaderplan:any,
  leaderowner:any,
  engineerplan:any,
  engineerowner:any,
  planresign:any,
  planregister:any,
  planresuit:any,
  remark:any 
};
  
export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};
