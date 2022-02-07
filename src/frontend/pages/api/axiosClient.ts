import axios, { AxiosInstance } from 'axios';

const tempToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTYwNjA2MDY2MDYwNjA2MDUwMDAwfQ.eyJpZHgiOjEsIm5pY2tuYW1lIjoidGVzdCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiJ9.RZ4DO4QGGF35gepcwAsWZfrV1EZxyF9OVmH1YjMrBLw';

export const axiosClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + tempToken,
  },
});
