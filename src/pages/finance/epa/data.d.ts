
export type CostRulesData = {
  sapCompanyCode?: string,
  costAlias?: string,
  costProject?: string,
  estimateProjectFlag?: string,
  areaFlag?: string,
  employeeTypeFlag?: string,
  curtainFlag?: string,
}
export type OptionsData = {
  label?: string,
  value?: string;
};
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
export type CompanyData = {
  companyCode?: string,
  companyShortName?: string,
  compantChineseName?: string,
  compantEnglishName?: string,
  sapCompanyCode?: string,
  psCompanyCode?: string,
  sapCompanyShortCode?: string,
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
export type AbstractRuleData = {
  costAlias?: string,
  costProject?: string,
  costAffiliationDateFlag?: string,
  areaTypeFlag?: string,
  costProjectFlag?: string,
  remarkFlag?: string,
  cashOutAbstractFlag?: string,
  manuFacturerShortName?: string,
}


export type VendorSourceType = {
  id: React.Key;
  companyCode?: string;
  vendorGeneral?: string;
  name?: string;
  paymentTermCompany?: string;
  beneficiaryName?: string;
  purchasingOrganization?: string;
  searchTerm1?: string;
  flag?: string;
  taxNo?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type CustomerSourceType = {
  id: React.Key;
  companyCode?: string;
  customerId?: string;
  customerName?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type AccountantCourseSourceType = {
  id: React.Key;
  courseCode?: string;
  courseName?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type CostRulesSource = {
  id: React.Key;
  companyCode?: string;
  costAlias?: string;
  costProject?: string;
  estimateProjectFlag?: string;
  areaFlag?: string;
  employeeTypeFlag?: string;
  curtainFlag?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type CostCenterSource = {
  id: React.Key;
  companyCode?: string;
  costCtr?: string;
  costName?: string;
  companyCode?: string;
  plant?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type AreaSource = {
  id: React.Key;
  companyCode?: string;
  areaCode?: string;
  areaName?: string;
  areaType?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type CompanySource = {
  id: React.Key;
  companyCode?: string;
  companyShortName?: string;
  companyChineseName?: string;
  companyEnglishName?: string;
  sapCompanyCode?: string;
  psCompanyCode?: string;
  psCompanyCodeTrusteeship?: string;
  sapCompanyShortCode?: string;
  taxpayerFlag?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type CurrencySource = {
  id: React.Key;
  currency?: string;
  currencyName?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type EmployeeTypeSource = {
  id: React.Key;
  employeeNickName?: string;
  employeeType?: string;
  employeeTypeName?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type TaxRateSource = {
  id: React.Key;
  taxRateCode?: string;
  taxRateDescribe?: string;
  taxRate?: string;
  invoiceType?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type SummaryRuleSource = {
  id: React.Key;
  companyCode?: string;
  costAlias?: string;
  costProject?: string;
  costAffiliationDateFlag?: string;
  areaTypeFlag?: string;
  costProjectFlag?: string;
  remarkFlag?: string;
  cashOutAbstractFlag?: string;
  manuFacturerShortName?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type ProfitCenterSource = {
  id: React.Key;
  profitCenter?: string;
  bu2?: string;
  customerGroup?: string;
  bpma?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type PlantSource = {
  id: React.Key;
  plantCode?: string;
  plantName?: string;
  companyCode?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type DelegationAuthSource = {
  id: React.Key;
  permissionCode?: string;
  currency?: string;
  chairman?: number;
  vicePresident?: number;
  topSupervisor?: number;
  causeSupervisor?: number;
  factorySupervisor?: number;
  leaderSupervisor?: number;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type OrganizationTreeSource = {
  id: React.Key;
  companyName?: string;
  departmentId?: string;
  companyCode?: string;
  siteDescription?: string;
  effectiveDate?: string;
  tier?: string;
  superstratumGroup?: string;
  groupName?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type CostAccountantCourseSource = {
  id: React.Key;
  companyCode?: string;
  costAlias?: string;
  costProject?: string;
  itemType?: string;
  areaType?: string;
  summonsType?: string;
  debtor?: string;
  debtorSubjectCode?: string;
  debtorSubjectName?: string;
  referenceKey?: string;
  lender?: string;
  lenderSubjectCode?: string;
  lenderSubjectName?: string;
  cctbFlag?: string;
  taxRate?: number;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};
export type CostDelegationAuthSource = {
  id: React.Key;
  companyCode?: string;
  costAlias?: string;
  costProject?: string;
  permissionCode?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
};

export type EstimateApportionMainSource = {
  id: React.Key;
  formId?: string;
  companyAlias?: string;
  billType?: string;
  costAlias?: string;
  costProject?: string;
  paNumber?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  taxRate?: string;
  costAffiliationDate?: string;
  currency?: string;
  totalMoney?: string;
  remark?: string;
  summary?: string;
  state?: string;
  departmentId?: string;
  balance?: string;
  crdate?: string;
  cruser?: string;
  updateTime?: string;
  updateUser?: string;
};
export type SaSummonSource = {
  id: number;
  formId?: string;
  sequenceNo?: string;
  companyCode?: string;
  documentDate?: string;
  postingDate?: string;
  documentType?: string;
  currencyKey?: string;
  exchangeRateDirectQuotation?: string;
  reference?: string;
  documentHeaderText?: string;
  postingKey?: string;
  account?: string;
  amountInDocumentCurrency?: string;
  amountInLocalCurrency?: string;
  costCenter?: string;
  profitCenter?: string;
  assignmentNumber?: string;
  taxCode?: string;
  itemText?: string;
  orderNumber?: string;
  customerGroupCode?: string;
  plant?: string;
  businessType?: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
  excelLineItemNo?: string;
  tradingPartner?: string;
  partnerProfitCente?: string;
  flag?: string;
  crdateTime?: string;
  crdateBy?: string;
  updateTime?: string;
  updateBy?: string;
}


export type invoiceParam = {
    pageIndex?: number;
    pageSize?: number;
    orderBy?: string;
    userSiteCode?: string;
    userLang?: string;
    userTimeZone?: number;
    data: {
      companyCode?: string;
      vendorCode?: string;
      invoiceCode?: string;
      invoiceNo?: string;
      invoiceType?: string;
      verifyStatus?: string;
      invoicePaymentStatus?: string
    }
};



