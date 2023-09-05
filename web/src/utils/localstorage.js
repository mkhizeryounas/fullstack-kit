const ls = window.localStorage;
const prefix = 'ws';

export const getKey = (key) => {
  return `${prefix}-${key}`;
};

export const set = ({ key, data }) => {
  ls.setItem(getKey(key), JSON.stringify(data));
};

export const get = (key) => {
  let data = ls.getItem(getKey(key));
  if (data) {
    data = JSON.parse(data);
  }
  return data;
};

export const remove = (key) => {
  ls.removeItem(getKey(key));
};

const localstorage = {
  set,
  get,
  remove,
  getKey,
};

export default localstorage;
