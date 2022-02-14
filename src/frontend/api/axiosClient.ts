import axios, { AxiosInstance } from 'axios';

let token: string | null = '';
if (typeof window !== 'undefined') {
  token = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '';
}
// const tempToken =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTIwMDAwMDAwMH0.eyJpZHgiOjEsIm5pY2tuYW1lIjoidGVzdCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiJ9.6P_NJvZhGGc4XAdVlm74rgIVIzPtXZbChaZCqBbUba4';

export const axiosClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});
