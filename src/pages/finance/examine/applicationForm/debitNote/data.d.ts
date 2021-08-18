// @ts-ignore
/* eslint-disable */

  export type DebitNoteParams = {
      referenceid?: string;
      formsite?: string;
      formid?: string;
      formname?: string;
      sequenceid?: string;
      applyerdeptid?: string;
      applyid?: string;
      applyname?: string;
      applydatetime?: string;
      applyext?: string;
      plantid?: string;
      refno?: string;
      vendorcode?: string;
      vendorname?: string;
      origincurrency?: string;
      aimcurrency?: string;
      exchangerate?: string;
      subject?: string;
      remark?: string;
      wh?: string;
      whcategory?: string;
      paidby?: string;
      paiddoc?: string;
      attachment?: string;
      askway?: string;
      companynamech?; string;
      companynameen?: string;
      lastremittancedate?: Date;
      isclose?: string;
  };
    
  export type SysDebitNote = {
    status?: string;
    msg?: string;
    data?: Map;
  };

  export type DataSourceType = {
    id: React.Key;
    title?: string;
    decs?: string;
    state?: string;
    created_at?: string;
    children?: DataSourceType[];
  };
  //公司相关信息
  export type CompanyData = {
    companyCode?: string,
    companyShortName?: string,
    compantChineseName?: string,
    compantEnglishName?: string,
    sapCompanyCode?: string,
    psCompanyCode?: string,
    sapCompanyShortCode?: string,
  };
  //币别
  export type currencys = {
    currency?: string,
    currencyName?: string,
  };
  //汇率
  export type exchangeRates = {
    accountCurrency?: string,
    changeCurrency?: string,
    exchangeRate?: string,
  };
  //主题
  export type subject = {
    subjectCode?: string,
    companyCode?: string,
    subject?: string,
  };
  //供应商公司
  export type vendor = {
    vendorCode?: string,
    vendorName?: string,
    flag?: string,
  };

  
