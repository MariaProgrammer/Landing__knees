document.addEventListener('DOMContentLoaded', () => {
    //Плавный скролл
  const anchors = document.querySelectorAll('a[href*="#"]');

  for (let anchor of anchors) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const blockID = anchor.getAttribute("href").substring(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
    // ----------Видеоплеер------------------
    const videoWrapper = document.getElementById('video-wrapper');
    const video = document.getElementById('custom-video-player');
    const playPauseBtn = videoWrapper.querySelector('.play-pause-button');

    // Функция, которая сработает ТОЛЬКО при клике на нашу кастомную кнопку
    const handleCustomButtonFirstPlay = () => {
        // 1. Добавляем класс, который скроет кнопку через CSS
        videoWrapper.classList.add('video-started');

        // 2. Даем команду на воспроизведение видео
        const playPromise = video.play();

        // 3. Обрабатываем возможные ошибки, чтобы избежать мусора в консоли
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Не удалось запустить видео:", error);
                // Если запуск не удался, можно вернуть кнопку обратно
                videoWrapper.classList.remove('video-started');
            });
        }
    };

    // Функция, которая сработает, когда видео доиграет до конца
    const handleVideoEnded = () => {
        // Браузер автоматически покажет постер или первый кадр.
        // Мы можем принудительно перемотать на начало для 100% гарантии.
        video.currentTime = 0;
        
        // ВАЖНО: Мы НЕ убираем класс 'video-started',
        // поэтому кастомная кнопка не появится снова.
        // Дальнейшее управление происходит через стандартные controls.
    };

    // Назначаем обработчики событий
    playPauseBtn.addEventListener('click', handleCustomButtonFirstPlay);
    video.addEventListener('ended', handleVideoEnded);



    // ---------------Валидация формы-----------------------
    const form = document.getElementById('requestForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    form.addEventListener('submit', function(event) {
        // Предотвращаем стандартную отправку формы
        event.preventDefault();

        // Сбрасываем предыдущие ошибки
        resetErrors();

        let isValid = true;

        // 1. Валидация поля "Name"
        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Это поле обязательно для заполнения');
            isValid = false;
        }

        // 2. Валидация поля "E-mail"
        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'Это поле обязательно для заполнения');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Пожалуйста, введите корректный E-mail');
            isValid = false;
        }

        // Если все поля прошли валидацию
        if (isValid) {
            alert('Форма успешно отправлена!');
            // Здесь может быть код для отправки данных на сервер (AJAX/Fetch)
            form.reset(); // Очищаем форму
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

    // Функция для проверки корректности E-mail с помощью регулярного выражения
    function isValidEmail(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
//функция открытия окна по любой из кнопок
const openPopupButtons = document.querySelectorAll('.btn, .header__email');
const popup = document.querySelector('.popup');
const cross = document.querySelector('.close-btn')
    
// 2. Дальнейший код остается точно таким же
openPopupButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    popup.classList.add('active');
    document.body.classList.add('stop-scroll');

  });
});
//функция закрытия окна на крестик
    
    cross.addEventListener('click', ()=> {
        popup.classList.remove('active')
        document.body.classList.remove('stop-scroll');

    })

});
