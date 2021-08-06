import React, {useState} from "react";
import {
  Container, Row, Col,
  Button,
  Form, Alert, InputGroup, FormControl
} from 'react-bootstrap';
// using ES6 modules
import {
  useHistory,
  useLocation,
  Link,
  Redirect
} from "react-router-dom";

export function RegistrationPage(props){
    let history = useHistory();
    
    const [email, setEmail] = useState('');
    const [copy, setCopyEmail] = useState('');
    const [invalidData,setError] = useState('');
    
    const callBackendAPI = async (form) => {
        const input = new FormData(form);
        const response = await fetch('/registration', {
            method: 'POST',
            body: input,
        })
        const body = await response;

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    };
    const Request = (e) => {
      e.preventDefault();
      callBackendAPI(e.target)
          .then(res => res.json())
          .then(body => {
            const {code,data} = body;
            if(code === 'error_validation')
                setError("Адреса не совпадают");
            else if(code === "email_already_exists")
                setError("Этот адрес уже занят. Используйте другой или попробуйте восстановить аккаунт.");
            else if(code === "rest_no_route")
                setError("Ошибка запроса. Попробуйте ещё раз или зайдите позднее.");
            else if(typeof data === 'object' && data.hasOwnProperty('account_v')){
                props.sign('up', data);
            }
          })
          .catch(err => setError(err));
    }

    if(props.auth){
        return <Redirect to="/account" />
    } 
    
    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <h3 className="mb-3 text-center title">Регистрация</h3>
                <Col xs={12} md={4}>
                    {invalidData && <Alert variant={"danger"}>{invalidData}</Alert>}
                    <Form onSubmit={Request}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Введите Ваш Email</InputGroup.Text>
                            <FormControl
                            name="email"
                            placeholder="email"
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                            />    
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Повторите Email</InputGroup.Text>
                            <FormControl
                            name="copy"
                            placeholder="копия email"
                            aria-label="Email Copy"
                            aria-describedby="basic-addon2"
                            />    
                        </InputGroup>
                        <Button variant="primary" type="submit" id="button-addon3">Отправить</Button>
                    </Form>
                </Col>
                <Col xs={12}>
                    <p className="text-center mt-5">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
                </Col>
            </Row>
        </Container>
    );
}