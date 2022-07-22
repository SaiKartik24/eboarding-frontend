import { resolveOrigin } from "./configs";

const host = resolveOrigin();

export function GetEmployeeByName(name) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/employee/" + name, options);
}

export function EmployeeApplicationAccess(reqData, id) {
  var options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqData),
  };
  return fetch(host + "/access/app/" + id, options);
}
