window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabcontainer');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) { // Параметр по умолчанию (стандарт ES6)
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer
    const deadline = 'January 20, 2023';

    function getTimeRemaning (endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / 1000 / 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }
        
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock (selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();
        
        function updateClock() { 
            const t = getTimeRemaning(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //Modal
    const btnOpenModal = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    let wasOpened = false;

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
        wasOpened = true;
    }

    btnOpenModal.forEach((item) => {
        item.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);
    

    function showModalByScroll () {
        if ((window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1)&&(wasOpened === false)) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем Классы для карточек
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    // Функция для получения данных по карточкам с сервера
    const getResource = async (url) => {
        const res = await fetch(url);

        // Обрабатываем проблемы у промисов с ошибками в http-запросах
        // Свойство .ok говорит при получении данных, что всё ок или не ок
        // Свойство status показывает тот статус, который вернул нам сервер
        if(!res.ok) {
            // Создаём ошибку вручную
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); //throw выкидывает нашу ошибку из функции
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });
    // Функция постинга данных
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

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
        openModal();

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
            closeModal();
        }, 4000);
    }

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));


    // Slider #1 Более лёгкий

    // const slides = document.querySelectorAll('.offer__slide'),
    //       prev = document.querySelector('.offer__slider-prev'),
    //       next = document.querySelector('.offer__slider-next'),
    //       total = document.querySelector('#total'),
    //       current = document.querySelector('#current');
    // let slideIndex = 1;

    // showSlides(slideIndex);

    // // Отображаем общее количество слайдов
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     // Устанавливаем граничные значение по перемещению слайдов
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     // Скрываем все слайды и показываем только нужный
    //     slides.forEach( item => item.style.display = 'none');
        
    //     slides[slideIndex - 1].style.display = 'block';

    //     // Отображаем текущий слайд
    //     if (slideIndex < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // // Функция для изменения slideIndex
    // function plusSlides(n) {
    //     showSlides(slideIndex += n);
    // }

    // // Добавляем обработчики событий клика на стрелки
    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });


    // Slider #2 Более сложный

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'), // нужен для создания динамических точек слайдера
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector(".offer__slider-wrapper"),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    
    let slideIndex = 1;
    let offset = 0;

    // Отображаем общее количество слайдов
    function totalSlides(totalSlides, currentSlide) {
        if (totalSlides.length < 10) {
            total.textContent = `0${totalSlides.length}`;
            current.textContent = `0${currentSlide}`;
        } else {
            total.textContent = totalSlides.length;
            current.textContent = currentSlide;
        }
    }

    totalSlides(slides, slideIndex);

    // Устанавливаем ширину для sliedsField и задаём фиксированную ширину каждому слайду
    slidesField.style.width = 100 * slides.length + '%';
    // Выстраиваем наши слайды друг за другом в линию
    // Добавляем transition для плавного передвижения
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    // Ограничиваем видимость слайдов
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    // Создание динамических точек для слайдера
    
    slider.style.position = 'relative';

    // Создаём большую обёртку для всех точек
    const indicators = document.createElement('ol'),
          dots =[];

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    // Создаём определённое кол-во точек на основе кол-ва слайдов
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        // Устанавливаем активную точку
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    // Функция для превращения в числовой тип данных
    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    // Отображаем текущее количество слайдов
    function currentSlides (currentSlides) {
        if (currentSlides < 10) {
            current.textContent = `0${currentSlides}`;
        } else {
            current.textContent = currentSlides;
        }
    }

    // Перемещаем(трансформируем) слайды
    function transformSlide (wrapper, offset) {
        wrapper.style.transform =`translateX(-${offset}px)`;
    }

    //Взаимодействие точек с переключением слайдов
    function activeDot (arrDots, currentSlide) {
        arrDots.forEach(dot => dot.style.opacity = '.5');
        arrDots[currentSlide - 1].style.opacity = 1;
    }


    // Навешиваем обработчики события клика и создаём функционал для передвижения слайдов
    next.addEventListener('click', () => {
        // Проверяем, что это конечный слайд или нет
        // Конвертируем переменную width в числовой тип данных
        if (offset == deleteNotDigits(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += deleteNotDigits(width);
        }

        transformSlide(slidesField, offset);

        // Контролируем перемещение slideIndex
        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        currentSlides(slideIndex);

        // Прописываем взаимодействие точек с переключением слайдов
        activeDot(dots, slideIndex);
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width);
        }

        transformSlide(slidesField, offset);

        // Контролируем перемещение slideIndex
        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        currentSlides(slideIndex);

        activeDot(dots, slideIndex);
    });

    //Добавляем функциональность к точкам
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            // Получаем data-атрибут точек
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = deleteNotDigits(width) * (slideTo - 1);
            //Перемещаем слайды
            transformSlide(slidesField, offset);

            currentSlides(slideIndex);

            activeDot(dots, slideIndex);
        });
    });


    // Сalculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        height, weight, age,
        ratio = 1.375;
          
    // Функция расчета по формуле
    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    // Получаем данные со статических элементов(div)
    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }
    
                elements.forEach(element => {
                    element.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    // Обрабатываем каждый отдельный инпут
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            // Проверка на НЕчисла в инпуте
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});
