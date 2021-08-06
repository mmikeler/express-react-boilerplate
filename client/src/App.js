import React, { createContext, useState, useEffect } from "react";
import './App.scss';
import { Container, Navbar, Dropdown, DropdownButton } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom";
// Components
import {LoginPage} from './components/Login/Login'
import {RegistrationPage} from './components/Registration/Registration'
// Templates
import {Logo} from "./components/Templates";
import {AccountPage} from "./components/account";
// Hooks
import {getUserData} from "./hooks/useUser"
// using ES6 modules
import {useHistory} from "react-router-dom";
// Context
const AuthContext = createContext(null);

export default function App(){
  const [auth,setAuth] = useState(false);
  const [user,setUserData] = useState(null);
  let history = useHistory();
  // Авторизация
  const sign = (action,data=null,forse=false) => {
    if(action === 'up'){
        setUserData(data);
        setAuth(true);
        return true;
    }
    else if(action === 'out'){
      if(!forse){
        window.confirm("Вы выходите из аккаунта.");
      }
      window.localStorage.removeItem("ch_session");  
      setAuth(false);
    }
    else{
      console.log('error sign');
    }
  }
  // Восстанавливаем данные при перезагрузке, если юзер был авторизован
  useEffect(() => {
    getUserData()
      .then((res) => res.json())
      .then((res) => {
        const {code,mess,user} = {...res};
        if(code === 'relogin'){
          setAuth(false);
        }
        else if(code === 'success'){
          setUserData(user);
          setAuth(true);
        }
        else{
          setAuth(false);
        }
      });
  },[])

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        <Navbar className="justify-content-sm-between px-3">
            <Logo />
            <AuthButton isAuth={auth} user={user} sign={sign} />
        </Navbar>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/login" render={(props) => <LoginPage auth={auth} sign={sign} />} />
          <Route path="/registration" render={(props) => <RegistrationPage auth={auth} {...props} sign={sign} />} />
          <Route path="/account" render={() => <AccountPage auth={auth} sign={sign} user={user} />} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

function AuthButton(props) {
  const isAuth = props.isAuth;

  return isAuth ? (
    <div className="position-relative">
      <UserNavbarOptions {...props} />
    </div>
  ) : (
    <Link to="/login">Войти</Link>
  );
}

function UserNavbarOptions(props){
  return(
    <DropdownButton
      variant={props.isAuth ? "outline-success" : "outline-danger"}
      size="sm"
      title={props.user.hasOwnProperty('renew') ? props.user.renew.profile.displayName : "None"}
      id="dropdown-menu-align-right"
    >
      <Dropdown.Item eventKey="1" as={Link} to="/account">Рабочий кабинет</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="2" onClick={() => props.sign('out')}>Выйти</Dropdown.Item>
    </DropdownButton>  
  )
}

function HomePage() {
  return (
    <Container>
      <h3>Home</h3>
    </Container>
  );
}