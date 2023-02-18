import { closeModal, openModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimerId) {
    const forms = document.querySelectorAll(formSelector);

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    // Функция привязки постинга данных
    function bindPostData (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            // Создаём formData и при помощи неё собираем все данные с нашей формы 
            const formData = new FormData(form);
            // Работа с JSON, но можно обойтись и без него, зависит от backend-разработчика
            // Перевод специфического объекта FormData в JSON
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            // ИЛИ создадим новый объект и поместим в него данные с FormData с помощью метода перебора forEach
            // const object = {};
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });
            // Через метод stringify превратим объект в формат JSON и отправим на сервер
            // const json = JSON.stringify(object);
            
            // Отправляем данные с formData на сервер
            // и обрабатываем наш запрос с помощью Промисов
            // fetch('server.php', {
            //     method: 'POST',
            //     // При работе с formData НЕ прописываем заголовки headers
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     // Работа с formData
            //     // body: formData
            //     // Работа с JSON
            //     body: json
            // });
            postData('http://localhost:3000/requests', json)
            .then((data) => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal('.modal', modalTimerId);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div data-close class="modal__close">&times;</div>
                <div class='modal__title'>${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');
        }, 4000);
    }

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));
}

export default forms;