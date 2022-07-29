import { resolveOrigin } from "./configs";

const host = resolveOrigin();

export function GetPendingApprovals(status) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/admin/request/" + status, options);
}

export function GetPendingAccess(status) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/admin/approved/" + status, options);
}

export function GetPendingInactiveEmployees() {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/admin/emp/Inactive/app/granted", options);
}

export function GetPendingInactiveMangers() {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/admin/manager/Inactive", options);
}
