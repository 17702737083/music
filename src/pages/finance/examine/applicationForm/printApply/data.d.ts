export type PrintApplyParams = {
    referenceid?: string;
    formname?: string;
    formid?: string;
    serialid?: string;
    sequenceid?: string;
    applyid?: string;
    applyname?: string;
    applyenname?: string;
    plydatetime?: string;
    draftflag?: string;
    applyerdeptid?: string;
    applyerdeptname?: string;
    applyphone?: string;
    fm3testmode?: string;
    applyer?: string;
    company?: string;
    companyname?: string;
    projectsort?: string;
    applyproject?: string;
    applyprojectname?: string;
    filekind?: string;
    kindfile?: string;
    kindfiles?: string;
    filesort?: string;
    filesortname?: string;
    proinstruction?: string;
    attachfile?: string;
    oattachfile?: string;
    tachfilesize?: string;
    hr?: string;
    manager?: string;
    assistant?: string;
    supervisor?: string;
    contractno?: string;
    applicantmanager?: string;
    agentdeptlist?: string;
    querysupervisor?: string;
    newfilename?: string;
    ofilename?: string;
    filesize?: string;
    attachfilecontent?: string;
    isclose?: string;
};
  
export type SysPrintApply = {
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

export type CompanyData = {
    companyCode?: string,
    companyShortName?: string,
    compantChineseName?: string,
    compantEnglishName?: string,
    sapCompanyCode?: string,
    psCompanyCode?: string,
    sapCompanyShortCode?: string,
  };