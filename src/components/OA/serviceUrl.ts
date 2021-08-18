const getFullUrl = (name: string) => {
  console.log(name + '當前環境:', REACT_APP_ENV);
  switch (REACT_APP_ENV) {
    //本機開發非core service時候選擇
    case 'dev':
      switch (name) {
        case 'core-system':
          return 'http://core-system.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'core-sign':
          return 'http://core-sign.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'core-utils':
          return 'http://core-utils.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'core-finance':
          return 'http://core-finance.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'finance-epa':
          return 'http://localhost:8080';
          break;
        case 'core-tpcn':
          return 'http://core-tpcn.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'truck':
          return 'http://localhost:8080';
          break;
        case 'itskill':
          return 'http://itskill.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'itskillreport':
          return 'http://itskill.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
          break;
        case 'gate':
          return 'http://localhost:8080';
          break;
        case 'hr':
          return 'http://localhost:8080';
          break;
        case 'poc':
          return 'http://localhost:8080';
          break;
        default:
          return 'http://localhost:8080';
          break;
      }
    //模擬測試環境
    case 'qas':
      return `http://${name}.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com`;
      break;
    //模擬正式環境
    case 'prd':
      return `http://${name}.k8sprdwksoa.10.66.224.2.k8sprd-wks.k8s.wistron.com`;
      break;
    //需要調試core-service時使用.記得修改後台對應端口
    case 'core-debug':
      switch (name) {
        case 'core-system':
          return 'http://localhost:88';
          break;
        case 'core-sign':
          return 'http://localhost:89';
          break;
        case 'core-utils':
          return 'http://localhost:90';
          break;
        case 'core-finance':
          return 'http://localhost:8080';
          break;
        case 'finance-epa':
          return 'http://localhost:8080';
          break;
        case 'truck':
          return `http://${name}.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com`;
          break;
        case 'gate':
          return 'http://localhost:8080';
          break;
        case 'hr':
          return 'http://localhost:8080';
          break;
        default:
          return 'http://localhost:8080';
          break;
      }
      break;

    default:
      return `http://localhost:8080`;
      break;
  }
};

export const coreSystemServiceUrl = getFullUrl('core-system');
export const coreSignServiceUrl = getFullUrl('core-sign');
export const coreUtilsServiceUrl = getFullUrl('core-utils');
export const truckServiceUrl = getFullUrl('truck');
export const gateServiceUrl = getFullUrl('gate');
export const hrServiceUrl = getFullUrl('hr');
export const epaServiceUrl = getFullUrl('finance-epa');
export const examineServiceUrl = getFullUrl('finance');
export const tpcnServiceUrl = getFullUrl('core-tpcn');
export const itskillServiceUrl = getFullUrl('itskill');
export const pocServiceUrl = getFullUrl('poc');

export const epaBaseUrl =
  'http://finance-epa-service.k8sdevwksoa.10.66.226.2.k8sdev-wks.k8s.wistron.com';
