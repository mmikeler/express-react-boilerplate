import React, { useState } from "react";
import {
  Container, Row, Col,
  Button, Alert,
  Form
} from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
// using ES6 modules
import {useHistory} from "react-router-dom";

export function LoginPage(props){
    let history = useHistory();
    
    const [email,useEmail] = useState('');
    const [pass,usePass] = useState('');
    const [invalidData,setError] = useState('');
    
    const callBackendAPI = async (form) => {
        const input = new FormData(form);
        const response = await fetch('/auth', {
            method: 'POST',
            body: input,
        })
        const body = await response;

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };

    const LoginRequest = (e) => {
        e.preventDefault();
        callBackendAPI(e.target)
            .then(res => res.json())
            .then(body => {
                const {code,data,session} = body;
                if(!data)
                    setError("Неверные данные для входа.");
                else if(code === "rest_no_route")
                    setError("Ошибка запроса. Попробуйте ещё раз или зайдите позднее.");
                else if(code === 'success'){
                    window.localStorage.setItem('ch_session',session);
                    props.sign('up',data) 
                    ? history.push('/account') 
                    : setError('Ошибка авторизации');
                }
                else{
                    setError('Ошибка авторизации');
                }
            })
            .catch(err => console.log(err));
    }

    const key = window.localStorage.getItem('ch_session');
    if(props.auth){
        console.log(props.auth,key);
        return <Redirect to="/account" />
    }

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <h3 className="mb-3 text-center title">Авторизация</h3>
                <Col xs={12} md={4}>
                    {invalidData && <Alert variant={"danger"}>{invalidData}</Alert>}
                    <Form onSubmit={LoginRequest}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" onChange={useEmail} type="email" placeholder="" />
                            <Form.Text className="text-muted">
                            Мы никогда не передадим Ваш email кому-либо.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control name="pass" onChange={usePass} type="password" placeholder="" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Запомнить логин" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Отправить
                        </Button>
                    </Form>
                </Col>
                <Col xs={12}>
                    <p className="text-center mt-5">Нет профиля? <Link to="/registration">Регистрация</Link></p>
                </Col>
            </Row>
        </Container>
    );
}