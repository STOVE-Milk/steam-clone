import axios, { AxiosInstance } from 'axios';

export const axiosClient = (token: any): AxiosInstance => {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
};
