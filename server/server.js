const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
const multer  = require('multer'); // для работы с файлами
const upload = multer();
const port = process.env.PORT || 5000;
// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));

// API
const api = require('./components/api');

// USERS
let users = [];

// Получение данных юзера
app.post('/auth', upload.none(), (req, res) => {
    api.auth(req,res, (userData) => {
        const key = userData.user_logged_key;
        users[key] = userData;
        res.send({code: 'success', data: userData.public, session: key});
    });
});
// Регистрация нового юзера
app.post('/registration', upload.none(), (req, res) => {
    api.registration(req,res);
});
// Получение профиля
app.post('/get_user', (req, res) => {
    const key = req.body.key;
    if(key){
        const user = users[key];
        if(user === undefined){
            res.end(JSON.stringify({ code: 'relogin', mess: 'Пользователь не найден', user: null}));
        }
        else{
            res.end(JSON.stringify({ code: 'success', mess: 'Пользователь найден', user: user.public}));
        }
    }
    else{
        res.end({ code: 'relogin', data: null});
    }
});
// Обновление профиля (public данных)
app.post('/update_profile', upload.none(), (req, res) => {
    const key = req.body.key;
    if(key){
        const user = users[key];
        if(user === undefined){
            res.end(result('relogin','Пользователь не найден',null));
        }
        else{
            let data = users[key];
            const userID = data.private.id;
            // обновляем данные в локальном объекте
            for(let option in data.public.renew.profile){
                for(let opt in req.body){
                    if(option === opt){
                        data.public.renew.profile[option] = req.body[opt];
                    }
                }
            }
            // Отправляем обновлённые данные и возвращаем результат обработки
            api.update_profile(userID, data.public.renew.profile, (shot) => {
                if(shot){
                    res.end(result('ok', 'Данные обновлены', null));}
                else{
                    res.end(result('error', 'Ошибка при обновлении', null));}
            });
        }
    }
    else{
        res.end(result('invalid key', '', null ));
    }
});

// Работа с архивом
app.post('/get_drive', upload.none(), (req, res) => {
    const key = req.body.key;
    if(key){
        const user = users[key];
        if(user === undefined){
            res.end(result('','Ключ НЕ найден',null));
        }
        else{
            const driveKey = user.public.renew.profile.actdrivekey;
            if(user.hasOwnProperty('drive')){
                user.drive._token = driveKey;
                user.drive.info().then(body => {
                        res.end(result('','',body));
                    })
            }
            else{
                console.log(user);
            }
        }
    }
})
app.post('/get_dir', upload.none(), (req, res) => {
    const key = req.body.key;
    const path = req.body.path;
    if(key){
        const user = users[key];
        if(user === undefined){
            res.end(result('','Ключ НЕ найден',null));
        }
        else{
            const driveKey = user.public.renew.profile.actdrivekey;
            if(user.hasOwnProperty('drive')){
                user.drive._token = driveKey;
                user.drive.list(path).then(body => {
                        res.end(result('','',body._embedded));
                    })
            }
            else{
                console.log(user);
            }
        }
    }
})

function result(code,mess,data){
    return(JSON.stringify({code:code,mess:mess,user:data}));
}