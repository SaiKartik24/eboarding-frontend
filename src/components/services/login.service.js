import { resolveOrigin } from "./configs";

const host = resolveOrigin();

export function GetAdmin() {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch( host+ "/admin", options);
}

export function LoginService(reqData, tokenn) {
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
      body: JSON.stringify(reqData),
  };

  return fetch(host + "/admin", options);
}