import React from "react";
import {Container, Row, Col} from 'react-bootstrap';
// using ES6 modules
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useLocation
} from "react-router-dom";
import "./account.sass";
// Components
import {Profile} from "./profile/profile";
import {Drive} from './archive/archive';

export function AccountPage(props) {
    //const key = window.localStorage.getItem('ch_session');
    if(!props.auth){
        return <Redirect to="/login" />
    }
    return(
        <Container fluid>
            <Row className="p-0">
                <Router>
                    <Col className="account-nav"><Nav /></Col>
                    <Col className="account-root">
                        <Switch>
                            <Route exact path="/account" component={Dashboard} />
                            <Route path="/account/disk" render={() => <Drive />} />
                            <Route path="/account/profile" render={() => <Profile sign={props.sign} user={props.user} />} />
                        </Switch>
                    </Col>
                </Router>
            </Row>
        </Container>
    );
}

function Nav(){
    const parts = [
        [ "Выйти", "/" ],
        [ "Сводка", "/account" ],
        [ "Архив", "/account/disk" ],
        [ "Профиль", "/account/profile"]
    ]
    const location = useLocation();
    const out = parts.map((path) => {
                    let active = location.pathname === path[1] ? "current" : "";
                    return <Link key={path[1]} className={active} to={path[1]}>{path[0]}</Link>
                })
    return(
        <div className="sidebar title">
            {out}
        </div>
    )
}

function Dashboard(){
    return(
        <h3>Dashboard</h3>
    )
}