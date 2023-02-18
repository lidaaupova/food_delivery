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

// Функция для получения данных по карточкам с сервера
const getResource = async (url) => {
    let res = await fetch(url);

    // Обрабатываем проблемы у промисов с ошибками в http-запросах
    // Свойство .ok говорит при получении данных, что всё ок или не ок
    // Свойство status показывает тот статус, который вернул нам сервер
    if(!res.ok) {
        // Создаём ошибку вручную
        throw new Error(`Could not fetch ${url}, status: ${res.status}`); //throw выкидывает нашу ошибку из функции
    }

    return await res.json();
};

export {postData, getResource};