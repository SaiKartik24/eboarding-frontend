import { resolveOrigin } from "./configs";

const host = resolveOrigin();

export function GetTemplateById(id) {
  var options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(host + "/template/" + id, options);
}
