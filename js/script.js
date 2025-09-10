document.addEventListener('DOMContentLoaded', () => {
    
    const container = document.getElementById('hero-animation-container');
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero__container'); 

    function setupAdaptiveAnimation() {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth <= 380;
        
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

            const finalHeroHeight = Math.max(imageBasedHeight, contentHeight);
            
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
        
        // --- ОБНОВЛЕННЫЕ УСЛОВИЯ: ГРАДАЦИОННОЕ СМЕЩЕНИЕ ---
        // Сначала проверяем самый узкий диапазон для максимального смещения
        if (screenWidth >= 375 && screenWidth <= 650) {
            // Итоговое смещение 50%
            bgPosX -= screenWidth * 0.50; 
        } 
        // Затем проверяем более широкий диапазон для стандартного смещения
        else if (screenWidth > 650 && screenWidth <= 980) {
            // Смещение 30%
            bgPosX -= screenWidth * 0.30;
        }
        // Для всех остальных разрешений (> 1200px) дополнительное смещение не применяется.
        // --- ---------------------------------------------------

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

            if (isValid) {
                alert('Форма успешно отправлена!');
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
});
