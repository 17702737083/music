import { parse } from 'querystring';



//获取页面跳转的参数
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getUrl = (portNumber) => {
   const url = window.location.href.split('?')[0];
   return url.split(portNumber)[1];
}

export const getArrayIndex = (arr, obj) => {
   var i = 0;
   var flag = false;
   for (i = 0; i < arr.length; i++) {
      if (arr[i].value == obj) {
         flag = true;
         break;
      }
   }
   if (flag == true) {
      return i;
   } else {
      return -1;
   }
}

/**
 * 时间戳转换为日期格式
 * @param {*} timestamp 
 * @param {*} formats 
 * @returns 
 */
export const dateFormat = function (timestamp, formats) {
   // formats格式包括
   // 1. Y-m-d
   // 2. Y-m-d H:i:s
   // 3. Y年m月d日
   // 4. Y年m月d日 H时i分
   formats = formats || 'Y-m-d';

   var zero = function (value) {
       if (value < 10) {
           return '0' + value;
       }
       return value;
   };

   var myDate = timestamp? new Date(timestamp): new Date();

   var year = myDate.getFullYear();
   var month = zero(myDate.getMonth() + 1);
   var day = zero(myDate.getDate());

   var hour = zero(myDate.getHours());
   var minite = zero(myDate.getMinutes());
   var second = zero(myDate.getSeconds());

   return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
       return ({
           Y: year,
           m: month,
           d: day,
           H: hour,
           i: minite,
           s: second
       })[matches];
   });
};