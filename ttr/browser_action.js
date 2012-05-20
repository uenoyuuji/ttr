window.onload = function() {
    document.getElementById('description').focus();
    document.getElementById('submit').addEventListener('click', function() {
        Tasks.addTask({
            title: document.getElementById('title').value,
            description: document.getElementById('description').value
        });
        Icon.update();
        window.close();
    });
    Tasks.getTasksForToday(function(tasks) {
        var list = document.getElementById('list');
        tasks.forEach(function(t) {
            var l = document.createElement('li');
            var c;
            if(t.title) {
                c = document.createElement('span');
                c.setAttribute('class', 'title');
                c.textContent = t.title;
                l.appendChild(c);
            }
            if(t.description) {
                c = document.createElement('span');
                c.setAttribute('class', 'description');
                c.textContent = t.description;
                l.appendChild(c);
            }
            c = document.createElement('button');
            c.textContent = 'done';
            c.addEventListener('click', function() {
                Tasks.removeTask(t.id);
                list.removeChild(l);
                Icon.update();
            });
            l.appendChild(c);
            list.appendChild(l);
        });
    });
};
