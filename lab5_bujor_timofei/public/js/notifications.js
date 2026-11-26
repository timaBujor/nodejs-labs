// Клиент Socket.IO: получает событие courseCreated и показывает уведомление
(function () {
    const socket = io();
    const box = document.getElementById('notifications');
    const list = document.getElementById('notifications-list');

    function updateVisibility() {
        box.classList.toggle('visible', list.children.length > 0);
    }

    function showNotification(data) {
        const item = document.createElement('div');
        item.className = 'notification';

        const close = document.createElement('button');
        close.className = 'notification-close';
        close.type = 'button';
        close.textContent = '×';
        close.title = 'Закрыть';
        close.addEventListener('click', remove);

        const title = document.createElement('div');
        title.className = 'notification-title';
        title.textContent = 'Добавлен новый курс: ' + data.title;

        const teacher = document.createElement('div');
        teacher.textContent = 'Преподаватель: ' + data.teacher;

        const time = document.createElement('div');
        time.className = 'notification-time';
        time.textContent = data.createdAt;

        item.append(close, title, teacher, time);
        list.prepend(item);
        updateVisibility();

        // Исчезает через 8 секунд
        const timer = setTimeout(remove, 8000);

        function remove() {
            clearTimeout(timer);
            item.remove();
            updateVisibility();
        }
    }

    socket.on('courseCreated', showNotification);
})();
