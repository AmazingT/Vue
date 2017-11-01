export function dateFormat(date, fmt) {
  if (/(y+)/.test(fmt)) {
    // 适配"yyyy"或者是"yy";转String类型 => + ''(尾部加一个空串) 或 .toString()
    fmt = fmt.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
  }
  // 月日时分秒格式化
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  // 遍历所有正则匹配表达式
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''; // o[k].toString();
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
