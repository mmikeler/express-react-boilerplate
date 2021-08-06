// Всплывающее сообщение

import { useEffect, useState } from "react";

export function Notice(props){

    const [time, setTime] = useState(null);

    useEffect(() => {
        setTime(props.time)
        setTimeout(() => {
            setTime(null)
        }, 2500)
    },[props.time])

    if(time){
        return(
            <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    {/* <img src="..." className="rounded me-2" alt="..." /> */}
                    <strong className="me-auto">{props.mess}</strong>
                    <small className="text-muted">только что</small>
                    <button onClick={() => setTime(null)} type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                </div>
                {/* <div className="toast-body">
                    Привет мир! Это тост-сообщение.
                </div> */}
            </div>
        )
    }
    else{
        return('');
    }

    
}