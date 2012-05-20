window.onload = function() {
    var timerId;
    var task = JSON.parse(localStorage.last_notified_task);
    document.getElementById('title').textContent = task.title;
    document.getElementById('description').textContent = task.description;
    document.body.addEventListener('click', function() {
        clearTimeout(timerId);
    });
    document.getElementById('done').addEventListener('click', function() {
        Tasks.removeTask(task.id);
        Icon.update();
        clearTimeout(timerId);
        window.close();
    });
    timerId = setTimeout(function() {
        window.close();
    }, 1000 * 3);
};
