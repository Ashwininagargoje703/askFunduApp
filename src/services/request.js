import { backend_url } from "../../https-common";
import Request from "./";
// let token = sessionStorage.getItem("token");

const ACCEPT_TYPE = "application/json";

export const getRequest = ({ url = "" }) => {
  return Request(backend_url)(url, {
    method: "GET",
  });
};

export const getAuthenticatedRequest = ({ url = "" }) => {
  let token = sessionStorage.getItem("token");

  return Request(backend_url)(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const doRequest = ({
  url = "",
  body = {},
  method = "POST",
  headers = {},
}) => {
  let token = sessionStorage.getItem("token");

  return Request(backend_url)(url, {
    method: method,
    data: body,
    headers: {
      Accept: ACCEPT_TYPE,
      "Content-Type": ACCEPT_TYPE,
      authorization: `Bearer ${token}`,
    },
  });
};
