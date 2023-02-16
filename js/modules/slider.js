function slider () {
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
}

module.exports = slider;