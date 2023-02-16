function modal() {
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

}

module.exports = modal;