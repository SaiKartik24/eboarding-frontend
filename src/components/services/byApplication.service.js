import { resolveOrigin } from "./configs";

const host = resolveOrigin();

export function GetApplicationName(name) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/access/application/" + name, options);
}

export function GetEmployeesByApplication(id) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/access/application/" + id, options);
}

export function GetApplicationById(id) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/application/" + id, options);
}
