import React from "react";
import {Link} from "react-router-dom";
import img from "../../img/logo-70.png";

export function Logo(){
    return <Link className="logo" to="/"><img width="70" src={img} alt="" /></Link>;
} 