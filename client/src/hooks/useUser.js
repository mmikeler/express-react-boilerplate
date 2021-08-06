  
export function getUserData(field = null, renew = false){
    const key = window.localStorage.getItem("ch_session");
    return request(key);
}

const request = (key) => {
    const response = fetch(`/get_user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key:key})
    });
    const body = response;
    return body;
}

export function isJson(str){
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

