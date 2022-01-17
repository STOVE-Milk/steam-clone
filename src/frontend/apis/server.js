import axios from 'axios';

export default AxiosSet = (baseUrl) => {
  axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
