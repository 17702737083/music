export type CreditNoteParams = {

    referenceid?: string;
    formname?: string;
    formid?: string;
    serialid?: string;
    sequenceid?: string;
    applyid?: string;
    applyname?: string;
    plydatetime?: string;
    draftflag?: string;
    applyerdeptid?: string;
    applyerdeptname?: string;
    fm3testmode?: string;
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
    offsetdno?: string;
    attachment?: string;
    attachment_o?: string;
    lastremittancedate?: string;
    financepic?: string;
    revised?: string;
    isfinance?: string;
    gmanager?: string;
    otherpic?: string;
    generalmanager?: string;
    filesize?: string;
    vendorrb?: string;
    totalprice?: string;
    signgroup?: string;
    signflag?: string;
    deputydirector?: string;
    financepiclz?: string;
    dnserialid?: string;
    companynamech?: string;
    companynameen?: string;
    signerorlz?: string;
    fmanager?: string;
    paidby?: string;
    paiddoc?: string;
    isclose?: string;
};
  
export type SysCreditNote = {
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

  export type currencys = {
    currency?: string,
    currencyName?: string,
  };