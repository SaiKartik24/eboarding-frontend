import { resolveOrigin } from "./configs";

const host = resolveOrigin();

export function GetEmployees() {
    var options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return fetch(host + "/employee", options);
}