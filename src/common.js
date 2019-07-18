/* import { parse } from "path"; */

//把时间戳格式化成年月日
 export function formatDate(timestamp) {
     var date = new Date(timestamp);
     var year = date.getFullYear();
     var month = addZero(date.getMonth() + 1);
     var day = addZero(date.getDate());
     /* var hours = addZero(date.getHours());
     var minutes = addZero(date.getMinutes());
     var seconds = addZero(date.getSeconds()); */
     // return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
     return year + "-" + month + "-" + day;
 }

 export  function addZero(num) {
    return num < 10 ? "0" + num : num;
}

export  function parseToNumber(str){
    return parseInt(str);
}
 