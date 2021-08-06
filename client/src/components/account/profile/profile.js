import React, { useContext, createContext, useState, useEffect } from "react";
import {Container, Row, Col, Form, FormControl, InputGroup, Button, Alert} from 'react-bootstrap';
import { getFieldOptions } from "../../../hooks/getFieldOptions";
import { CallAPI } from "../../../hooks/callAPI";
import { Notice } from "../../Templates/notice";
import { Ymap } from "../../../controllers/ymap";

export function Profile(props){

    const [profile,setProfile] = useState(null);
    const [invalidData,setError] = useState(null);
    const [notice, setNotice] = useState(null);
    const [loader, isLoading] = useState(false);
    
    useEffect(() => {
      setProfile(props.user.renew.profile);
    },[props.user.renew.profile])
    
    if(!profile){
      return(<Alert variant={"danger"}>Ошибка рендера компонента.</Alert>);}

    const userFields = [];
    for(let field in profile){
        userFields.push(<div>{field} : {JSON.stringify(profile[field])}</div>)
    }

    const submit = (e) => {
      e.preventDefault();
      isLoading(true);
      CallAPI(e.target, '/update_profile')
        .then(res => res.json())
        .then(body => {
          const {code,data} = body;
          if(code === 'error_validation'){
            setError("Адреса не совпадают");
          }
          else if(code === 'relogin'){
            props.sign('out',null,true);
          }
          else if(code === "rest_no_route"){
            setError("Ошибка запроса. Попробуйте ещё раз или зайдите позднее.");
          }
          else if(code === 'ok'){
            setNotice(new Date().getTime());
          }
          else{
            console.log('error submit result');
          }
          isLoading(false);
        })
        .catch(err => { setError(err.code); isLoading(false); });
    }

    return(
      <Container className="px-0">
          {invalidData && <Alert variant={"danger"}>{invalidData}</Alert>}
          <Notice time={notice} mess="Настройки сохранены" />
          <div className="text-muted title mb-3">/ Ваш профиль</div>
          <Row>
            <Form onSubmit={submit}>
              <FieldGroup title="Персональные данные">
                  <RenewFields fields={profile} group="userData" />
              </FieldGroup>
              <FieldGroup title="Хранилище">
                  <RenewFields fields={profile} group="userDrive" />
              </FieldGroup>
              <FieldGroup title="Карта">
                <Ymap />
              </FieldGroup>
              <Button className="float-end" variant="outline-primary" type="submit">{loader ? 'Обработка' : 'Сохранить'}</Button>
            </Form>
          </Row>
      </Container>
    )
}

function FieldGroup(props){
  return(
    <Container fluid className="field-group-wrapper mb-5">
      <div className="title mb-2 text-uppercase">{props.title}</div>
      <Row>{props.children}</Row>
    </Container>
  );
}

function RenewFields(props){
    const fields = [];
    for(let field in props.fields){
        let value = props.fields[field];
        const set = getFieldOptions(field);
        const sizeData = set.size ? set.size : [12,12,12];
        // Выводим поля только из указанной группы
        if(set.group === props.group){
          // Выводим поле
          if(typeof value === "string" || typeof value === "number"){
            fields.push(
              <Col style={{order: set.order}} key={field} xs={sizeData[0]} md={sizeData[1]} lg={sizeData[2]}>
                <Field
                set={set}
                fieldValue={value}
                />
              </Col>
            )
          }
        }
    }
    return fields;
}

function Field(props){
    const {set, fieldValue} = props;
    const [value,setValue] = useState(fieldValue);
    const onChange = (e) => {
      setValue(e.target.value);
    }
    const unlockField = (e) => {
      const target = e.target;
      const field = target.previousElementSibling;
      field.removeAttribute('disabled');
    }
    return(
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <InputGroup key={set.fieldName}>
            <InputGroup.Text id={set.fieldName}>{set.label}</InputGroup.Text>
            {set.type === 'text' &&
              <FormControl
              placeholder={set.placeholder}
              aria-label={set.fieldName}
              aria-describedby={set.fieldName}
              onChange={onChange}
              disabled={set.disabled}
              value={value}
              name={set.fieldName}
              />
            }
            {set.type === 'textarea' &&
              <FormControl
              as="textarea"
              onChange={onChange}
              disabled={set.disabled}
              value={value}
              name={set.fieldName}
              aria-label={set.fieldName}
              />
            }
            {set.locked &&
              <InputGroup.Text
              onClick={unlockField}
              className="input-unlock-btn">Разблокировать</InputGroup.Text>
            }
          </InputGroup>
          <Form.Text className="text-muted" dangerouslySetInnerHTML={{ __html: set.caption }}></Form.Text>
        </Form.Group>
    )
}