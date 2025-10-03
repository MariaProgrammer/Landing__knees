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
    // --- НОВЫЙ КОД: ФУНКЦИЯ ДЛЯ СКРЫТИЯ ПРЕЛОАДЕРА ---
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        const body = document.body;

        preloader.classList.add('preloader--hidden'); // Добавляем класс для плавного исчезновения
        body.classList.remove('preloading'); // Убираем класс с body, чтобы контент стал видимым
    }

    setupAdaptiveAnimation();
    // Прячем прелоадер после того, как все готово.
    // Можно добавить небольшую задержку, чтобы анимация плиток успела начаться.
    setTimeout(hidePreloader, 200);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setupAdaptiveAnimation, 500);
    });

    // --- НАЧАЛО БЛОКА ЛОГИКИ ДЛЯ CTA-КНОПКИ (ОПТИМИЗИРОВАННАЯ ВЕРСИЯ) ---

    // --- 1. Находим все нужные элементы на странице ---
    const ctaButton = document.querySelector('.button--cta');
    const openButtons = document.querySelectorAll('.btn-open:not(.hero__btn), .start__btn');
    const footer = document.querySelector('footer');

    // Проверяем, нашлись ли все элементы, чтобы избежать ошибок
    if (!ctaButton || !footer) {
        console.error("Не найден элемент .button--cta или <footer>!");
        return; // Выходим, если чего-то не хватает
    }

    // --- 2. Создаем хранилище для координат элементов ---
    let elementPositions = {
        buttons: [],
        footerTop: 0
    };

    // --- 3. Функция для вычисления и сохранения координат ---
    // Эта "дорогая" функция будет вызываться только один раз при загрузке и при ресайзе.
    function calculateElementPositions() {
        elementPositions.buttons = []; // Очищаем массив перед пересчетом
        const scrollY = window.scrollY;

        // Вычисляем позиции для кнопок
        openButtons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            // Сохраняем абсолютную позицию от верха документа
            elementPositions.buttons.push({
                top: rect.top + scrollY,
                bottom: rect.bottom + scrollY
            });
        });

        // Вычисляем позицию для футера
        const footerRect = footer.getBoundingClientRect();
        elementPositions.footerTop = footerRect.top + scrollY;
    }

    // --- 4. "Легкая" и быстрая функция, которая будет работать на каждый скролл ---
    const handleCtaButtonVisibility = () => {
        const viewportTop = window.scrollY;
        const viewportBottom = viewportTop + window.innerHeight;

        // --- Проверяем видимость кнопок (используя сохраненные данные) ---
        let isAnyButtonVisible = false;
        for (const pos of elementPositions.buttons) {
            // Условие пересечения: (Начало_A <= Конец_B) и (Конец_A >= Начало_B)
            if (pos.top < viewportBottom && pos.bottom > viewportTop) {
                isAnyButtonVisible = true;
                break; // Если нашли хоть одну видимую кнопку, дальше проверять нет смысла
            }
        }

        // --- Проверяем видимость футера (используя сохраненные данные) ---
        const isFooterVisible = viewportBottom > elementPositions.footerTop;

        // --- Применяем ВАШУ точную логику, но с быстрыми вычислениями ---
        let shouldBeVisible;

        if (window.innerWidth < 768) {
            // Логика для мобильных
            shouldBeVisible = viewportTop > 300;
        } else {
            // Логика для десктопа
            const scrollTrigger = window.innerHeight * 0.90;
            shouldBeVisible = viewportTop > scrollTrigger;
        }

        // --- ФИНАЛЬНОЕ РЕШЕНИЕ: Показываем кнопку, только если:
        // 1. Основное условие (scroll) выполнено
        // 2. Ни одна из других кнопок не видна
        // 3. Футер еще не виден
        const finalDecision = shouldBeVisible && !isAnyButtonVisible && !isFooterVisible;
        ctaButton.classList.toggle('is-visible', finalDecision);
    };


    // --- 5. Вешаем обработчики событий ---

    // Вычисляем позиции один раз при загрузке страницы
    calculateElementPositions();

    // Вызываем функцию при скролле (очень производительно)
    window.addEventListener('scroll', handleCtaButtonVisibility, { passive: true });

    // Пересчитываем позиции при изменении размера окна
    let resizeTimeout2;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout2);
        resizeTimeout2 = setTimeout(() => {
            calculateElementPositions();
            handleCtaButtonVisibility(); // Обновляем видимость сразу после пересчета
        }, 200);
    });

    // Также вызовем функцию один раз при загрузке на случай,
    // если страница загрузилась уже прокрученной
    handleCtaButtonVisibility();

    // --- КОНЕЦ БЛОКА ЛОГИКИ ДЛЯ CTA-КНОПКИ ---
    // --- НАЧАЛО НОВОГО БЛОКА: ЛОГИКА АКТИВНОГО СОСТОЯНИЯ И ЗАКРЫТИЯ ---

if (ctaButton) {
    // --- 1. Функция для закрытия активного состояния ---
    // Вынесена в отдельную функцию для переиспользования
    const closeCtaActiveState = () => {
        // Предполагаем, что активное состояние задается классом 'is-active'
        ctaButton.classList.remove('is-visible');
    };

    // --- 2. Обработчик клика по самой кнопке ---
    // Открывает/закрывает активное состояние
    ctaButton.addEventListener('click', (event) => {
        // toggle переключает класс: добавляет, если его нет, и убирает, если он есть
        ctaButton.classList.toggle('is-visible');
    });

    // --- 3. Обработчик для закрытия по клавише ESC ---
    document.addEventListener('keydown', (event) => {
        // Проверяем, что нажата именно клавиша Escape и кнопка сейчас активна
        if (event.key === 'Escape' && ctaButton.classList.contains('is-visible')) {
            closeCtaActiveState();
        }
    });

    // --- 4. Обработчик для закрытия по клику вне элемента ---
    document.addEventListener('click', (event) => {
        // Проверяем, что кнопка активна и что клик был НЕ по ней или ее дочерним элементам
        // event.target - это элемент, по которому кликнули
        // ctaButton.contains(event.target) - вернет true, если клик был внутри кнопки
        if (ctaButton.classList.contains('is-visible') && !ctaButton.contains(event.target)) {
            closeCtaActiveState();
        }
    });
}

// --- КОНЕЦ НОВОГО БЛОКА ---

    // Плавный скролл
    const anchors = document.querySelectorAll('a[href*="#"]');

    for (let anchor of anchors) {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const blockID = anchor.getAttribute("href").substring(1);
            document.getElementById(blockID).scrollIntoView({                
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
            // 1. Показываем стандартные элементы управления
            video.controls = true;

            // 2. Добавляем класс, который скроет нашу кастомную кнопку через CSS
            videoWrapper.classList.add('video-started');

            // 3. Запускаем воспроизведение
            const playPromise = video.play();

            // 4. Обрабатываем возможные ошибки (например, автоплей заблокирован браузером)
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Не удалось запустить видео:", error);
                    // Если запуск не удался, возвращаем все как было
                    video.controls = false;
                    videoWrapper.classList.remove('video-started');
                });
            }
        };

        const handleVideoEnded = () => {
            video.currentTime = 0;
            // По желанию, можно вернуть все в исходное состояние, когда видео закончилось:
            // video.controls = false;
            // videoWrapper.classList.remove('video-started');
        };

        // Вешаем обработчик на кнопку. Опция { once: true } гарантирует,
        // что этот обработчик сработает только один раз, что нам и нужно.
        playPauseBtn.addEventListener('click', handleCustomButtonFirstPlay, { once: true });

        video.addEventListener('ended', handleVideoEnded);
    }

    // --------------- Модальное окно (Popup) -----------------------
    const openPopupButtons = document.querySelectorAll('.btn-open, .header__email, .button--cta-btn');
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
        pagination: {
            el: '.swiper-pagination-video',
        },
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
    const photoSwiper = new Swiper(".photo-gallery__slider", {
        // Настройки по умолчанию (для мобильных)
        loop: true,
        slidesPerView: "auto", // Оставляем 'auto' для мобильных, чтобы CSS контролировал ширину
        spaceBetween: 11,      // Расстояние для мобильных
        centeredSlides: true,  // Центрируем активный слайд на мобильных

        autoplay: {
            delay: 2500,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
        },

        // Адаптивность для экранов от 768px и выше (десктоп)
        breakpoints: {
            // Медиа-запрос "от 768px и выше"
            768: {
                slidesPerView: 4,     // <-- ИЗМЕНЕНИЕ: Показываем 4 слайда
                spaceBetween: 20,     // <-- Расстояние для десктопа
                centeredSlides: false,// <-- Отключаем центрирование
            },
            // Можно добавить еще один breakpoint для очень больших экранов, если нужно
            1200: {
                slidesPerView: 5,     // Например, 5 слайдов на больших мониторах
                spaceBetween: 20,
                centeredSlides: false,
            }
        },
    });


    // --- ЛОГИКА ЛАЙТБОКСА ДЛЯ ФОТО (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---
    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = lightbox.querySelector(".lightbox__image");
    const lightboxCloseButton = lightbox.querySelector(".lightbox__close-button");
    const lightboxOverlay = lightbox.querySelector(".lightbox__overlay");

    // --- ИЗМЕНЕНИЕ 1: Находим контейнер слайдов вместо отдельных слайдов ---
    const swiperWrapper = document.querySelector(".photo-gallery__slider .swiper-wrapper");

    const openLightbox = (imageElement) => {
        if (!imageElement) return; // Добавим проверку на всякий случай

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
        lightboxImage.src = "";
    };

    // --- ИЗМЕНЕНИЕ 2: Используем делегирование событий ---
    // Вешаем один обработчик на wrapper
    if (swiperWrapper) {
        swiperWrapper.addEventListener("click", (event) => {
            // Находим ближайший родительский слайд к элементу, по которому кликнули
            const clickedSlide = event.target.closest(".photo-gallery__slide");

            // Если клик был действительно по слайду (или его содержимому)
            if (clickedSlide) {
                const imageInSlide = clickedSlide.querySelector(".photo-gallery__image");
                openLightbox(imageInSlide);
            }
        });
    }


    // Обработчики закрытия (остаются без изменений)
    lightboxCloseButton.addEventListener("click", closeLightbox);
    lightboxOverlay.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !lightbox.classList.contains("lightbox--hidden")) {
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
