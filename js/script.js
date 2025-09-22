document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-animation-container');
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero__container');
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');


    function setupAdaptiveAnimation() {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 768;

        // Ваши пути к файлам
        const desktopImage = 'img/hero__bg.webp';
        const mobileImage = 'img/hero__bg--mob.webp';

        const imageSrc = isMobile ? mobileImage : desktopImage;
        const tileSize = isMobile ? 25 : 100;

        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const imageRatio = img.naturalHeight / img.naturalWidth;
            const imageBasedHeight = screenWidth * imageRatio;
            const contentHeight = heroContent.scrollHeight;

            let finalHeroHeight; // Объявляем переменную для итоговой высоты

            // --- НОВАЯ ЛОГИКА: УСТАНОВКА ВЫСОТЫ В 60% ЭКРАНА ---
            const isConstrainedHeight = screenWidth >= 320 && screenWidth <= 650;

            if (isConstrainedHeight) {
                // Для этого диапазона ширин, принудительно устанавливаем высоту в 60% от высоты видимой области.
                finalHeroHeight = window.innerHeight * 0.50;
            } else {
                // Для всех остальных разрешений используем старую логику, чтобы вместить контент и картинку.
                finalHeroHeight = Math.max(imageBasedHeight, contentHeight);
            }
            // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

            heroSection.style.height = `${finalHeroHeight}px`;

            createGrid(img.naturalWidth, img.naturalHeight, tileSize, imageSrc, finalHeroHeight);
        };
        img.onerror = () => {
            console.error("Не удалось загрузить изображение для анимации:", imageSrc);
        }
    }

    function createGrid(imageNaturalWidth, imageNaturalHeight, tileSize, imageSrc, screenHeight) {
        container.innerHTML = '';

        const screenWidth = window.innerWidth;

        const cols = Math.ceil(screenWidth / tileSize);
        const rows = Math.ceil(screenHeight / tileSize);

        let bgWidth, bgHeight, bgPosX, bgPosY;

        const containerRatio = screenWidth / screenHeight;
        const imageRatio = imageNaturalWidth / imageNaturalHeight;

        if (containerRatio > imageRatio) {
            bgWidth = screenWidth;
            bgHeight = screenWidth / imageRatio;
            bgPosX = 0;
            bgPosY = (screenHeight - bgHeight) / 2;
        } else {
            bgHeight = screenHeight;
            bgWidth = screenHeight * imageRatio;
            bgPosX = (screenWidth - bgWidth) / 2;
            bgPosY = 0;
        }

        if (screenWidth >= 320 && screenWidth <= 768) {
            bgPosX -= screenWidth * 0.01;
        }
        else if (screenWidth > 769 && screenWidth <= 992) {
            bgPosX -= screenWidth * 0.10;
        }

        const backgroundSize = `${bgWidth}px ${bgHeight}px`;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');

                const tileLeft = j * tileSize;
                const tileTop = i * tileSize;

                tile.style.width = `${tileSize}px`;
                tile.style.height = `${tileSize}px`;
                tile.style.backgroundImage = `url('${imageSrc}')`;
                tile.style.top = `${tileTop}px`;
                tile.style.left = `${tileLeft}px`;
                tile.style.backgroundSize = backgroundSize;
                tile.style.backgroundPosition = `-${tileLeft - bgPosX}px -${tileTop - bgPosY}px`;

                let delay;
                if (i < 2) {
                    delay = (cols - j - 1) * 0.04 + (i * 0.03) + Math.random() * 0.05;
                } else {
                    const baseDelay = 0.3;
                    delay = baseDelay + (cols - j - 1) * 0.05 + Math.random() * 0.1;
                }
                tile.style.transitionDelay = `${delay}s`;

                container.appendChild(tile);
            }
        }

        setTimeout(() => {
            document.querySelectorAll('.tile').forEach(tile => {
                tile.classList.add('is-visible');
            });
        }, 100);
    }

    // --- НОВЫЙ КОД: ЗАПУСК АНИМАЦИИ ТЕКСТА ПОСЛЕ АНИМАЦИИ ПЛИТОК ---
    // Длительность анимации плиток = 1.8с. Запускаем текст примерно в это время.
    setTimeout(() => {
        if (window.innerWidth > 768) {
            // ИЗМЕНЕНИЕ ЗДЕСЬ: Находим все элементы с классом-триггером и запускаем их анимацию
            document.querySelectorAll('.animate-on-load').forEach(el => {
                el.classList.add('is-visible');
            });
        }
    }, 1800);



    setupAdaptiveAnimation();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setupAdaptiveAnimation, 500);
    });



    // Плавный скролл
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
    if (videoWrapper) { // Добавим проверку на наличие элемента
        const video = document.getElementById('custom-video-player');
        const playPauseBtn = videoWrapper.querySelector('.play-pause-button');

        const handleCustomButtonFirstPlay = () => {
            videoWrapper.classList.add('video-started');
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Не удалось запустить видео:", error);
                    videoWrapper.classList.remove('video-started');
                });
            }
        };

        const handleVideoEnded = () => {
            video.currentTime = 0;
        };

        playPauseBtn.addEventListener('click', handleCustomButtonFirstPlay);
        video.addEventListener('ended', handleVideoEnded);
    }

    // --------------- Модальное окно (Popup) -----------------------
    const openPopupButtons = document.querySelectorAll('.btn-open, .header__email');
    const popup = document.querySelector('.popup');
    const cross = document.querySelector('.close-btn');

    // Функция открытия окна по любой из кнопок
    openPopupButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
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


    // --- ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА SWIPER ---
    const swiper = new Swiper('.video-slider', {
        // Опции
        loop: true, // Бесконечная прокрутка
        slidesPerView: 'auto', // Автоматическое определение количества видимых слайдов
        centeredSlides: true, // Активный слайд всегда по центру
        spaceBetween: 10, // Расстояние между слайдами

        // Автопрокрутка
        autoplay: {
            delay: 3000, // Задержка 3 секунды
            disableOnInteraction: false, // Не отключать после ручного переключения
            pauseOnMouseEnter: true, // Пауза при наведении мыши
        },

        // Адаптивность
        breakpoints: {
            768: {
                spaceBetween: 20,
            }
        }
    });


    // --- ЛОГИКА МОДАЛЬНОГО ОКНА С ВИДЕО ---
    const modal = document.querySelector('.video-modal');
    const videoSlides = document.querySelectorAll('.video-slider__slide');
    const modalVideoWrapper = document.querySelector('.video-modal__video-wrapper');
    const closeModalButton = document.querySelector('.video-modal__close-button');
    const modalOverlay = document.querySelector('.video-modal__overlay');

    // ИСПРАВЛЕНО: Обновленная функция открытия модального окна
    const openModal = (videoSrc) => {
        // Очищаем контейнер от предыдущего видео
        modalVideoWrapper.innerHTML = '';

        // Создаем элемент видео
        const videoElement = document.createElement('video');
        videoElement.src = videoSrc;
        videoElement.controls = true; // ДОБАВЛЕНО: Элементы управления включены
        videoElement.autoplay = true; // Оставляем для совместимости
        videoElement.muted = true;    // ДОБАВЛЕНО: Запускаем видео без звука (ключевой момент для автозапуска)
        videoElement.playsInline = true; // Улучшает воспроизведение на iOS
        videoElement.classList.add('video-modal__video');

        // Добавляем видео в контейнер
        modalVideoWrapper.appendChild(videoElement);

        // Программно запускаем воспроизведение. Это более надежно, чем просто autoplay.
        const playPromise = videoElement.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Воспроизведение было заблокировано браузером.
                // Ничего страшного, у пользователя есть кнопка play.
                console.error("Autoplay was prevented: ", error);
            });
        }

        // Показываем модальное окно
        modal.classList.remove('video-modal--hidden');
        document.body.classList.add('body--modal-open'); // Блокируем скролл фона
    };

    const closeModal = () => {
        // Скрываем модальное окно
        modal.classList.add('video-modal--hidden');
        document.body.classList.remove('body--modal-open');

        // Останавливаем видео и очищаем контейнер
        const video = modalVideoWrapper.querySelector('video');
        if (video) {
            video.pause();
            modalVideoWrapper.innerHTML = '';
        }
    };

    // Навешиваем обработчики кликов на каждый слайд (остается без изменений)
    videoSlides.forEach(slide => {
        slide.addEventListener('click', () => {
            const videoSrc = slide.dataset.videoSrc;
            if (videoSrc) {
                openModal(videoSrc);
            }
        });
    });

    // Обработчики закрытия модального окна (остается без изменений)
    closeModalButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Закрытие по клавише Escape (остается без изменений)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('video-modal--hidden')) {
            closeModal();
        }
    });

    // --- ЛОГИКА ТАЙМЕРА (простой пример) ---
    // Для реального проекта таймер должен синхронизироваться с сервером
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    let timeInSeconds = (12 * 3600) + (45 * 60) + 22;

    const updateTimer = () => {
        if (timeInSeconds <= 0) {
            clearInterval(timerInterval);
            return;
        }

        timeInSeconds--;

        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    };

    const timerInterval = setInterval(updateTimer, 1000);

    // --- ИНИЦИАЛИЗАЦИЯ ВТОРОГО СЛАЙДЕРА (PHOTO GALLERY) ---
    // Используем новый, уникальный селектор, чтобы избежать конфликтов
    const photoSwiper = new Swiper(".photo-gallery__slider", {
        loop: true,
        slidesPerView: "auto", // Автоматически определяет кол-во слайдов на основе их CSS-ширины
        spaceBetween: 11,

        autoplay: {
            delay: 2500,
            disableOnInteraction: true, // Отключает автопрокрутку после свайпа/клика
            pauseOnMouseEnter: true, // Ставит на паузу при наведении мыши
        },

        // Адаптивность
        breakpoints: {
            768: {
                spaceBetween: 20,
            },
        },
    });

    // --- ЛОГИКА ЛАЙТБОКСА ДЛЯ ФОТО ---
    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = lightbox.querySelector(".lightbox__image");
    const lightboxCloseButton = lightbox.querySelector(
        ".lightbox__close-button"
    );
    const lightboxOverlay = lightbox.querySelector(".lightbox__overlay");
    const photoSlides = document.querySelectorAll(".photo-gallery__slide");

    const openLightbox = (imageElement) => {
        const imgSrc = imageElement.src;
        const imgAlt = imageElement.alt;

        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;

        lightbox.classList.remove("lightbox--hidden");
        document.body.classList.add("body--modal-open");
    };

    const closeLightbox = () => {
        lightbox.classList.add("lightbox--hidden");
        document.body.classList.remove("body--modal-open");
        // Очищаем src, чтобы избежать "мелькания" старого фото при следующем открытии
        lightboxImage.src = "";
    };

    // Навешиваем обработчики на каждый слайд
    photoSlides.forEach((slide) => {
        slide.addEventListener("click", () => {
            const imageInSlide = slide.querySelector(".photo-gallery__image");
            if (imageInSlide) {
                openLightbox(imageInSlide);
            }
        });
    });

    // Обработчики закрытия
    lightboxCloseButton.addEventListener("click", closeLightbox);
    lightboxOverlay.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
        if (
            e.key === "Escape" &&
            !lightbox.classList.contains("lightbox--hidden")
        ) {
            closeLightbox();
        }
    });

    // --- ИНИЦИАЛИЗАЦИЯ ТРЕТЬЕГО СЛАЙДЕРА (RESULTS) ---
    const resultSlider = new Swiper('.result__slider', {
        loop: true,
        slidesPerGroup: 1,
        spaceBetween: 20,

        // Настройки по умолчанию (для мобильных)
        slidesPerView: 1,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Навигация и пагинация
        navigation: {
            nextEl: '.result__slider-button-next',
            prevEl: '.result__slider-button-prev',
        },
        pagination: {
            el: '.result__slider-pagination',
            clickable: true,
        },

        // Переопределение для десктопа
        breakpoints: {
            769: {
                slidesPerView: 'auto',
                centeredSlides: false,
                autoplay: false,
            }
        },

        // Доступность
        a11y: {
            prevSlideMessage: 'Предыдущий отзыв',
            nextSlideMessage: 'Следующий отзыв',
            paginationBulletMessage: 'Перейти к отзыву {{index}}',
        },
    });

    // --- СКРИПТ ДЛЯ ПЛАВНОЙ АНИМАЦИИ АККОРДЕОНА ---
    // Этот скрипт является прогрессивным улучшением.
    // Аккордеон будет работать и без него, но анимация будет резкой.

    const detailsElements = document.querySelectorAll('.faq__item');

    detailsElements.forEach(details => {
        const summary = details.querySelector('.faq__question');
        const content = details.querySelector('.faq__answer-content');

        summary.addEventListener('click', (event) => {
            // Отменяем стандартное поведение (мгновенное открытие/закрытие)
            event.preventDefault();

            if (!details.open) {
                // --- Открываем элемент ---
                details.open = true;

                // Запускаем анимацию
                const animation = content.animate(
                    { height: ['0px', `${content.scrollHeight}px`] },
                    { duration: 300, easing: 'ease-out' }
                );

                // Когда анимация завершена, убираем фиксированную высоту,
                // чтобы контент мог адаптироваться, если изменится размер окна.
                animation.onfinish = () => {
                    content.style.height = 'auto';
                };

            } else {
                // --- Закрываем элемент ---
                const animation = content.animate(
                    { height: [`${content.scrollHeight}px`, '0px'] },
                    { duration: 300, easing: 'ease-in' }
                );

                // Когда анимация завершена, закрываем <details>
                animation.onfinish = () => {
                    details.open = false;
                    content.style.height = 'auto'; // Сбрасываем высоту
                };
            }
        });
    });

});
