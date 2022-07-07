// This function is for retrieving the origin of the userdata from localstorage i,e used throughout the application
export function resolveUserData() {
    let data = localStorage.getItem("userData");
    data = JSON.parse(data);
    return data;
}
// This function is for retrieving the role of the user from localstorage i,e used throughout the application
export function resolveUserRole() {
    let data = localStorage.getItem("userData");
    data = JSON.parse(data);
    return data.role;
}

export function resolveOrigin() {
    let origin = "http://localhost:5001/api"
    return origin;
}