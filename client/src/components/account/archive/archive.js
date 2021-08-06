import { useEffect, useState } from "react"
import { getDrive } from "../../../hooks/getDrive";
import { Table, Button } from 'react-bootstrap';
import DriveLogo from '../../../img/yandex_disk_logo.png';
import LineIcon from "react-lineicons";
import './archive.sass';
import React from "react";


export function Drive(){

    const [table,setTable] = useState(null);
    const [path,setPath] = useState('app:/');
    const [space, setSpace] = useState(null);

    useEffect(() => {
        getDrive().then(res => res.json()).then(body => {
                setSpace(body.user)
            })
        getDrive(path).then(res => res.json()).then(body => {
            setTable(body.user);
        })
    },[path])

    const setPathFunc = (path) => {
        setPath(path)
    }

    return(
        <React.Fragment>
            <DriveSpace space={space} />
            <DriveTable 
                setPath={setPathFunc} 
                rows={table} 
                path={path} />
        </React.Fragment>
    )
}

function DriveSpace(props){
    const info = props.space;
    const total = info ? info.total : 0;
    const unused = info ? info.used : 0;
    const used = total - unused;
    const percent = info ? 100 - Math.round(unused/(total/100)) : 0;
    return(
        <div className="drive-info-bar">
            <div className="drive-info-bar__icon">
                <img src={DriveLogo} alt="yandex-disk" />
            </div>
            <div className="drive-info-bar__used" style={{width: percent + '%'}}>{used} MB</div>
            <div className="drive-info-bar__total">{unused} MB</div>
        </div>
    );
}

function DriveTable(props){
    
    const rows = props.rows ? props.rows.items : [];
    let table = [];

    if(rows){
        for(let row in rows){
            let rowData = rows[row];
            if(rowData)
                table.push(<Row setPath={props.setPath} row={rows[row]} />)
        }
    }

    const moveUp = (path) => {
        let arrPath = path.split('/');
        if(arrPath.length > 1){
            arrPath.pop();}
        else{
            return;
        }
        let newPath = '';
        arrPath.forEach((el,ind) => {
            if(el === 'app:'){
                newPath += el + '/';
            }
            else{
                 newPath += ind === arrPath.length - 1 ? el : el + '/';
            }
        })
        props.setPath(newPath);
    }

    return (
        <React.Fragment>
        <div className="breadcrumbs breadcrumbs--drive mt-3">
            <Button onClick={() => moveUp(props.path)} variant="outline-primary">
                <LineIcon style={{fontSize: '30px'}} name="arrow-left" />
            </Button>
            {props.path}
        </div>
        <Table hover borderless className="mt-2">
            <tbody>
                {table.length < 1 ? <b className="px-2 text-muted">Директория пуста</b> : table}
            </tbody>
        </Table>
        </React.Fragment>
    );
}

function Row(props){
    // comment_ids:
    // private_resource: [string]
    // public_resource: [string]
    // created: [string]
    // exif: {}
    // modified: [string]
    // name: [string]
    // path: [string]
    // resource_id: [string]
    // revision: [number]
    // type: "dir"
    const item = props.row;
    const path = decodeURI(item.path).replace('disk:/Приложения/CHOOSE', 'app:');
    return(
        <tr>
            <td>{item.type === 'dir' ? <LineIcon name="folder" /> : <img src={item.preview} alt="" /> }</td>
            <td className="pointer" onClick={() => props.setPath(path)}>{item.name}</td>
            {/* <td>{path}</td> */}
            <td className="tar">{item.created}</td>
        </tr>
    )
}