import axios from 'axios';

const AxiosSet = (baseUrl) => {
  axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export default AxiosSet;
