import Axios from "axios";
const axios = (baseURL = "") => {
  const axiosInstance = Axios.create({
    baseURL,
  });
  return axiosInstance;
};

export default axios;
