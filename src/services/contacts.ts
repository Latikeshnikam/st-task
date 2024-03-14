import axios from "axios";
import config from "../config/config";
import { PRODUCT } from "../constants/backend.constants";

type ListContactApi = {
  query?: Record<string, any>;
};

const listContacts = (args?: ListContactApi) => {
  let url = config.BACKEND_BASE + PRODUCT.CONTACT;

  let query = args?.query || {};
  return axios.get(url, {
    params: query,
  });
};

export { listContacts };
