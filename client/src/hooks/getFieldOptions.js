// Коллекция свойств полей
export function getFieldOptions(fieldName){
    return(
        fields.hasOwnProperty(fieldName)
        ? fields[fieldName]
        : {
            fieldName: '???',
            type: 'text',
            label: '???',
            disabled: true,
            placeholder: 'Неизвестное поле'
        }
    )
}

function authUrl(params) {
    let url = 'https://oauth.yandex.ru/authorize?'
        url += 'response_type=token'
        url += '&client_id=159527890aee42b699bc57022fb0afbc'
        //[& device_id=<идентификатор устройства>]
        //[& device_name=<имя устройства>]
        url += '&redirect_uri=https://oauth.yandex.ru/verification_code'
        //[& login_hint=<имя пользователя или электронный адрес>]
        //[& scope=<запрашиваемые необходимые права>]
        //[& optional_scope=<запрашиваемые опциональные права>]
        url += '&force_confirm=yes'
        //[& state=<произвольная строка>]
        url += '&display=popup'
    return url;
}

const fields = {
    'displayName': {
        fieldName: 'displayName', // дублируем для простоты получения
        type: 'text',
        label: 'Публичное имя',
        caption: 'Под этим именем Вы будете представлены в профиле и каталоге.',
        disabled: false,
        locked: false,
        required: true,
        group: 'userData',
        size: [12,6,4],
        order: 1,
    },
    'companyName': {
        fieldName: 'companyName',
        type: 'text',
        label: 'Название Вашей компании',
        caption: 'Под этим флагом Вы будете представлены в профиле и каталоге.',
        disabled: false,
        locked: false,
        required: false,
        group: 'userCompanyData',
        size: [12,6,6],
        order: 1,
    },
    'phone': {
        fieldName: 'phone',
        type: 'text',
        label: 'Ваш телефон',
        caption: 'С этим номером Вы будете представлены в профиле и каталоге.',
        disabled: false,
        locked: false,
        required: true,
        group: 'userData',
        size: [12,6,4],
        order: 1,
    },
    'email': {
        fieldName: 'email',
        type: 'text',
        label: 'Ваш email',
        caption: 'С этим адресом Вы будете представлены в профиле и каталоге.',
        disabled: false,
        locked: false,
        required: true,
        group: 'userData',
        size: [12,6,4],
        order: 1,
    },
    'bio': {
        fieldName: 'bio',
        type: 'textarea',
        label: 'О себе',
        caption: 'С этим описанием Вы будете представлены в профиле и каталоге.',
        disabled: false,
        locked: false,
        required: false,
        group: 'userData',
        size: [12,12,12],
        order: 10,
    },
    'userdrive': {
        fieldName: 'userdrive',
        type: 'text',
        label: 'Тип архива',
        caption: 'Компания-поставщик хранилища',
        disabled: true,
        locked: false,
        required: false,
        group: 'userDrive',
        size: [12,3,3],
        order: 1,
    },
    'actdrivekey': {
        fieldName: 'actdrivekey',
        type: 'text',
        label: 'Ключ архива',
        caption: `Ключ к сервисам компании-поставщика хранилища. Получите ключ приложения <a rel="noreferrer" target="_blank" href=${authUrl()}>на этой странице</a> и вставьте его в поле выше .`,
        disabled: true,
        locked: true,
        required: false,
        group: 'userDrive',
        size: [12,9,9],
        order: 1,
    }
    
}