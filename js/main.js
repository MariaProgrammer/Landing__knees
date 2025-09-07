document.addEventListener('DOMContentLoaded', () => {
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
});
