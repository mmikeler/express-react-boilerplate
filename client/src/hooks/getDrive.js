const getDrive = async (path = null) => {
    if(!path){
        return info();
    }
    else{
        return dir(path);
    }
};

export {getDrive};

async function info(){
    let reqBody = new FormData();
    reqBody.append( 'key', window.localStorage.getItem('ch_session') );
    const response = await fetch('/get_drive', {
        method: 'POST',
        body: reqBody,
    })
    
    const body = await response;

    if (response.status !== 200) {
        //throw Error(body.message)
    }

    return body;
}

async function dir(path){
    let reqBody = new FormData();
    reqBody.append( 'key', window.localStorage.getItem('ch_session') );
    reqBody.append( 'path', path );
    const response = await fetch('/get_dir', {
        method: 'POST',
        body: reqBody,
    })
    
    const body = await response;

    if (response.status !== 200) {
        //throw Error(body.message)
    }

    return body;
}