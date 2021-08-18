declare namespace API {
  export type CostEstimateApportionForm = {
    epaEstimateApportionMain: EpaEstimateApportionMain;
    estimateApportionAttach1s: EstimateApportionAttach1s[];
    epaEstimateApportionDetails: EpaEstimateApportionDetails[];
    epaEstimateApportionDetails2: EpaEstimateApportionDetails2[];
  };
  export type EpaEstimateApportionMain = {

  };
  export type EstimateApportionAttach1s = {

  };

  export type EpaEstimateApportionDetails = {

  };

  export type EpaEstimateApportionDetails2 = {

  };



  export type TableListData = {
    list: TableListItem[];
    pagination: Partial<TableListPagination>;
  };


  type SysDictHead = {
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

  type SysDictDetail = {
    id?: number;
    dictKey?: string;
    dictValue?: string;
    dictValueSort?: number;
    dictValueLabel?: string;
    isDefault?: number;
    [string?]: any;
  };
  export type OptionsData = {
    label?: string,
    value?: string;
  };
  export type CostRulesData = {
    sapCompanyCode?: string,
    costAlias?: string,
    costProject?: string,
    estimateProjectFlag?: string,
    areaFlag?: string,
    employeeTypeFlag?: string,
    curtainFlag?: string,
  }
  export type AreaTypesData = {

    areaCode?: string,
    areaName?: string,
    areaType?: string,

  }
  export type DepartmentData = {
    companyName?: string,
    departmentId?: string,
    companyCode?: string,
    siteDescription?: string,
    effectiveDate?: string,
    hierarchy?: string,
    superstratumGroup?: string,
    groupName?: string,

  }
}