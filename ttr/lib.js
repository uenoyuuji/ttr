var Day = function(time) {
    var d = new Date(time);
    this.y = d.getFullYear();
    this.m = d.getMonth();
    this.d = d.getDate();
};

Day.prototype = {
    sameAs: function(otherDay) {
        return this.y === otherDay.y && this.m === otherDay.m && this.d === otherDay.d;
    }
};

var Tasks = {
    _generateId: function(storage) {
        return Date.now();
    },
    /**
     * @param {Object} task
     * @example
     * Tasks.addTask({
     *     title: null,
     *     description: 'buy a milk',
     *     start_at: Date.now() + 1000 * 60 * 60 * 24
     * });
     */
    addTask: function(task) {
        var tasks = localStorage.tasks;
        tasks = tasks ? JSON.parse(tasks) : {};
        var id = Tasks._generateId();
        task.id = id;
        if(!task.start_at) {
            task.start_at = Date.now();
        }
        tasks[id] = task;
        localStorage.tasks = JSON.stringify(tasks);
    },
    /**
     * An argument 'callback' will receive a task you wants. The task hasn't last_notified_at,
     * or it has the most oldest last_notified_at in today's tasks.
     * @param {Function} callback
     */
    getTaskForNow: function(callback) {
        Tasks.getTasksForToday(function(tasks) {
            var t = null;
            tasks.some(function(task) {
                if(!task.last_notified_at) {
                    t = task;
                    return true;
                } else {
                    if(!t || task.last_notified_at < t.last_notified_at) {
                        t = task;
                    }
                    return false;
                }
            });
            callback(t);
        });
    },
    getTasksForToday: function(callback) {
        var today = new Day(Date.now());
        var tasks = localStorage.tasks;
        if(!tasks) {
            callback([]);
            return;
        }
        tasks = JSON.parse(tasks);
        var t = [];
        var id;
        for(id in tasks) {
            if(today.sameAs(new Day(tasks[id].start_at))) {
                t.push(tasks[id]);
            }
        }
        callback(t);
    },
    /**
     * @param {Number} id
     * @example
     * Tasks.getTasksForToday(function(task) {
     * 
     *     // notifying...
     * 
     *     Tasks.notified(task.id);
     * });
     */
    notified: function(id) {
        var tasks = localStorage.tasks;
        if(!tasks) {
            throw new Error('illegal status');
        }
        tasks = JSON.parse(tasks);
        if(tasks[id]) {
            tasks[id].last_notified_at = Date.now();
        }
        localStorage.tasks = JSON.stringify(tasks);
    },
    removeTask: function(id) {
        var tasks = localStorage.tasks;
        if(!tasks) {
            return;
        }
        tasks = JSON.parse(tasks);
        if(tasks[id]) {
            delete tasks[id];
        }
        localStorage.tasks = JSON.stringify(tasks);
    }
};

var Icon = {
    update: function() {
        Tasks.getTasksForToday(function(tasks) {
            chrome.browserAction.setBadgeText({text: (tasks.length ? '' + tasks.length : '')});
        });
    }
};
