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

export function AddEmployee(reqData) {
    var options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
    };

    return fetch(host + "/employee", options);
}