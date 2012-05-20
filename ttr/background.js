(function() {
    var taskNotifyInterval = 1000 * 60 * 0.5;
    var iconUpdateInterval = 1000 * 60;
    Icon.update();
    setInterval(Icon.update, iconUpdateInterval);
    setInterval(function() {
        Tasks.getTaskForNow(function(task) {
            if(task) {
                localStorage.last_notified_task = JSON.stringify(task);
                webkitNotifications.createHTMLNotification('notification.html').show();
                Tasks.notified(task.id);
            }
        });
    }, taskNotifyInterval);
})();
