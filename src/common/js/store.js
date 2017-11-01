/**
 * localStroage存储数据
 */
export function saveToLocal(id, key, value) {
  // 先获取浏览器存储的__seller__
  let seller = window.localStorage.__seller__;
  // 如果不存在则创建一个对象
  if (!seller) {
    seller = {};
  } else {
  // 存在(字符串格式)则转为对象
    seller = JSON.parse(seller);
  }
  seller[id] = {};
  // 添加键值对
  seller[id][key] = value;
  // 存储为字符串格式
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function fromToLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  let sellerID = JSON.parse(seller)[id];
  if (!sellerID) {
    return def;
  }
  let value = sellerID[key];
  return value || def;
};

