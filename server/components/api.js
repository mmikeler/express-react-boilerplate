// Класс для работы с серверным API
// Одновременно хранит данные пользователя
const request = require('request');
const { nanoid } = require('nanoid');
const drive = require('./drive.js');

class Api{
    constructor(){
        /* Данные пользователя
        * ID: '2',
        * user_login: 'demouser',
        * user_pass: '$P$Bdch9blevhsaxfHhaVejCeD3cnOMIY0',
        * user_nicename: 'demouser',
        * user_email: 'demo@mail.demo',
        * user_url: '',
        * user_registered: '2021-02-08 22:05:24',
        * user_activation_key: '',
        * user_status: '0',
        * display_name: 'demouser'
        */
       this.setUser = this.setUser.bind(this);
       this.result = this.result.bind(this);
       this.auth = this.auth.bind(this);
       this.registration = this.registration.bind(this);
       this.update_profile = this.update_profile.bind(this);
    }
    request = request;
    nanoid = nanoid;
    serverUrl = 'https://be-original.ru/wp-json/choose/v1';
    
    isJson(str){
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    result( response,mess ){
        const data = this.isJson(response.body)
            ? JSON.parse(response.body)
            : {public:{}}
        return {
            code: response.statusCode,
            mess: mess,
            data: data.public, // Отдаём на фронт только публичные данные
            _data: response // Удалить на проде
        }
    }

    auth(req,res,cb){
        const reout = {};
        // Шаблон ответа
        const result = this.result;
        const nanoid = this.nanoid;
        // Подготавливаем объект для передачи
        for (const [key, value] of Object.entries(req.body)) {
            reout[key] = value;
        }
        // Готовим данные для запроса api
        const clientServerOptions = {
            url: this.serverUrl + "/ch_auth",
            form: reout,
            method: "POST",
            /*
            ** Данный contentType работает с PHP, 
            ** если ваш сервер написан на другом языке
            ** возможно, вам понадобится заменить это значение
            */
            contentType: 'application/x-www-form-urlencoded',
        }
        // Отправляем запрос и передаём ответ на фронт
        this.request.post(clientServerOptions, function (error,response,body) {
            if(error === null){
                const data = JSON.parse(body);
                if(data){
                    if(data.code === 'invalid_data'){
                        res.send(result(response, 'invalid_data'));
                    }
                    else{
                        data.user_logged_time = new Date().getTime();
                        data.user_logged_key = nanoid(10);
                        // Устанавливаем бъект Хранилища
                        drive.module._token = data.public.renew.profile.actdrivekey;
                        data.drive = drive.module;
                        // Возвращаем
                        cb(data);
                    }
                }
                else{
                    res.send(result(response,'Нет данных'));
                }
            }
            else{
                res.send(result(error, 'Ошибка'));
            }
        });
    }

    registration(req,res){
        const reout = {};
        // Шаблон ответа
        const result = this.result;
        // Подготавливаем объект для передачи
        for (const [key, value] of Object.entries(req.body)) {
            reout[key] = value;
        }
        // Валидация полей
        if(reout.email !== reout.copy){
            res.send({code:'error_validation',data:{}});
            return;
        }
        // Готовим данные для запроса api
        const clientServerOptions = {
            url: this.serverUrl + "/ch_reg",
            form: reout,
            method: "POST",
            /*
            ** Данный contentType работает с PHP, 
            ** если ваш сервер написан на другом языке
            ** возможно, вам понадобится заменить это значение
            */
            contentType: 'application/x-www-form-urlencoded',
        }
        // Отправляем запрос и передаём ответ на фронт
        this.request.post(clientServerOptions, function (error, response, body) {
            if(error === null){
                const data = JSON.parse(body);
                if(typeof data === 'object' && data.private.hasOwnProperty('id')){
                    this.user = data;
                    res.send(result(response, 'Регистрация прошла успешно'));
                }
                else if(data === 'email_already_exists'){
                    res.send({code: 'email_already_exists', data:{}});
                }
                else if(data === 'registration_failed'){
                    res.send({code: 'registration_failed', data:{}});
                }
                else if(data === 'registration_failed_step_two'){
                    res.send({code: 'registration_failed_step_two', data:{}});
                }
            }
            else{
                res.send(result(error, 'Ошибка'));
            }
        });
    }

    update_profile(userID,newProfileData,cb){
        const out = {
            userid: userID,
            new_profile: newProfileData
        };
        // Готовим данные для запроса api
        const clientServerOptions = {
            url: this.serverUrl + "/ch_update_profile",
            form: out,
            method: "POST",
            /*
            ** Данный contentType работает с PHP, 
            ** если ваш сервер написан на другом языке
            ** возможно, вам понадобится заменить это значение
            */
            contentType: 'application/x-www-form-urlencoded',
        }
        // Отправляем запрос и передаём ответ на фронт
        this.request.post(clientServerOptions, function (error, response, body) {
            if(error === null){
                console.log(body);
                cb(true);
            }
            else{
                console.log(error);
                cb(false);
            }
        })
    }

    get user(){
        return this.user;
    }

    setUser(data){
        if(data === null) return
        data.user_logged_time = new Date().getTime();
        data.user_logged_key = this.nanoid(10);
        this.user = data;
    }
}

module.exports = new Api();