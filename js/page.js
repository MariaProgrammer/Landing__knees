document.addEventListener('DOMContentLoaded', () => {

  // Плавный скролл
    // const anchors = document.querySelectorAll('a[href*="#"]');

    // for (let anchor of anchors) {
    //     anchor.addEventListener("click", function (e) {
    //         e.preventDefault();
    //         const blockID = anchor.getAttribute("href").substring(1);
    //         document.getElementById(blockID).scrollIntoView({
    //             behavior: "smooth",
    //             block: "start",
    //         });
    //     });
    // }
     // --------------- Модальное окно (Popup) -----------------------
    const openPopupButtons = document.querySelectorAll('.btn-open, .header__email');
    const popup = document.querySelector('.popup');
    const cross = document.querySelector('.close-btn');

    // Функция открытия окна по любой из кнопок
    openPopupButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(button)
            popup.classList.add('active');
            document.body.classList.add('stop-scroll');
        });
    }); // <-- ВОТ ЗДЕСЬ ЗАКАНЧИВАЕТСЯ ЦИКЛ forEach. ОН БЫЛ ЗАКРЫТ В САМОМ КОНЦЕ ФАЙЛА.

    // Функция закрытия окна на крестик (теперь она ВНЕ цикла)
    if (cross) { // Добавим проверку на наличие элемента
        cross.addEventListener('click', () => {
            popup.classList.remove('active');
            document.body.classList.remove('stop-scroll');
        });
    }

    // --------------- Валидация формы (теперь она ВНЕ цикла) -----------------------
    const form = document.getElementById('requestForm');

    // Важно: если формы на странице нет, дальнейший код вызовет ошибку.
    // Поэтому добавляем проверку.
    if (form) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            resetErrors();
            let isValid = true;

            // 1. Валидация поля "Name"
            if (nameInput.value.trim() === '') {
                showError(nameInput, nameError, 'This field is required');
                isValid = false;
            }

            // 2. Валидация поля "E-mail"
            if (emailInput.value.trim() === '') {
                showError(emailInput, emailError, 'This field is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }

            if (isValid) {
                alert('Form submitted successfully!');
                form.reset();
                // опционально - закрыть попап после успешной отправки
                if (popup) {
                    popup.classList.remove('active');
                    document.body.classList.remove('stop-scroll');
                }
            }
        });

        // Функция для отображения ошибки
        function showError(inputElement, errorElement, message) {
            inputElement.classList.add('error');
            errorElement.textContent = message;
        }

        // Функция для сброса ошибок
        function resetErrors() {
            nameInput.classList.remove('error');
            nameError.textContent = '';
            emailInput.classList.remove('error');
            emailError.textContent = '';
        }

        // Функция для проверки корректности E-mail
        function isValidEmail(email) {
            const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(String(email).toLowerCase());
        }
    }
})