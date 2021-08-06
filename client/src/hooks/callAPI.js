// Обращение к серверу. Отправка формы, получение тела ответа.

const CallAPI = async (form, point = null) => {
    let reqBody = new FormData(form);
    reqBody.append( 'key', window.localStorage.getItem('ch_session') );
    const response = await fetch(point, {
        method: 'POST',
        body: reqBody,
    })
    
    const body = await response;

    if (response.status !== 200) {
        throw Error(body.message) 
    }
    
    return body;
};

export {CallAPI};