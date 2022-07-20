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
