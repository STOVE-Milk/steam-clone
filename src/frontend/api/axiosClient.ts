import axios, { AxiosInstance } from 'axios';
import { verifyToken } from 'util/verifyToken';

let token: string | null = '';
if (typeof window !== 'undefined') {
  verifyToken();
  token = window.localStorage.getItem('accessToken');
}

export const axiosClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
