import axios from 'axios';
import { API_URL } from '../constants';
import ls from './localstorage';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(async (value) => {
  const token = ls.get('user')?.accessToken;
  value.headers = {
    Authorization: `Bearer ${token}`,
  };
  return value;
});

export default instance;
