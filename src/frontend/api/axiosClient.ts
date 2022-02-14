import axios, { AxiosInstance } from 'axios';

let token: string | null = '';
if (typeof window !== 'undefined') {
  token = window.localStorage.getItem('accessToken');
}

export const axiosClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
