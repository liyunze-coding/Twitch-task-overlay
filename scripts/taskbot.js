const taskList = document.querySelector("#task-list-body");
const taskCounter = document.querySelector("#counters");
const completed_task_count = document.querySelector("#completed-task-count");
const task_count = document.querySelector("#task-count");
const container = $(".outer-container");

let lastPosition;
let up = false;
let delay = false;
let reached = false;

if (!localStorage.tasks){
    localStorage.setItem(`tasks`, '{}');
}
if (!localStorage.userData){
    localStorage.setItem(`userData`, '{}');
}

/*
commands:

!task - adds a task to layout
!done - strikes off task as completed
!remove - removes your previous task
!clear - (broadcaster only) clears the entire task list
!cleardone - (broadcaster only) clears the completed tasks in the task list

*/

// automatically scroll up and down the list
setInterval(() => {
    let position = container.scrollTop();

    if(position === lastPosition){
        up = !up
    }

    lastPosition = position;

    if (up) {
        // Going up
        container.scrollTop(position - 1); 
    } else {
        // Going down
        container.scrollTop(position + 1); 
    }
}, 80);

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
    message = message.trim(); //trim message so no whitespaces
    tasks = JSON.parse(localStorage.tasks);
    userData = JSON.parse(localStorage.userData);

    if( command === "task" ) {
        if (message.trim() === ''){
            return ComfyJS.Say(`@${user} "!task [task]" to add your task to the list; "!done" when you're done with your task; "!remove" if you made a typo in the previous task.`);
        }

        if (userData[`${user}-pending_task`] /*&& user !== 'RyanPython'*/){
            return ComfyJS.Say(`@${user} You still have a task pending: ${tasks[`${user}${userData[`${user}_count`]}`].task}`)
        } else {
            userData[`${user}-pending_task`] = true;
        }

        if (!userData[`${user}_count`]){
            userData[`${user}_count`] = 1;
        } else {
            userData[`${user}_count`]++;
        }

        tasks[`${user}${userData[`${user}_count`]}`] = {
            "username": user,
            "userColor": extra.userColor,
            "task": message,
            "done": false
        }

        localStorage.setItem(`tasks`, JSON.stringify(tasks));
        localStorage.setItem(`userData`, JSON.stringify(userData));
        ComfyJS.Say(`@${user} Added new task: ${message}!`);
    } 
    
    else if (command === "done"){
        if (!userData[`${user}-pending_task`]){
            return ComfyJS.Say(`@${user} Can't find your task`);
        } else {
            let key = `${user}${userData[`${user}_count`]}`;
            userData[`${user}-pending_task`] = false;
            tasks[key].done = true;

            localStorage.setItem(`tasks`, JSON.stringify(tasks));
            localStorage.setItem(`userData`, JSON.stringify(userData));
            
            ComfyJS.Say(`${user} has finished task: ${tasks[key].task}. That's ${userData[`${user}_count`]} task(s) completed! Keep going!`);
        }
    } 
    
    else if ([`rm`, `remove`, `removetask`].includes(command)){
        if (!userData[`${user}_count`]){
            ComfyJS.Say(`@${user} Can't find your task`);
        } else {
            let key = `${user}${userData[`${user}_count`]}`;

            userData[`${user}-pending_task`] = false;
            userData[`${user}_count`] = userData[`${user}_count`] - 1;

            delete tasks[key];
            localStorage.setItem(`tasks`, JSON.stringify(tasks));
            localStorage.setItem(`userData`, JSON.stringify(userData));

            ComfyJS.Say(`${user} has removed their previous task`);
        }
    }

    else if (command === 'cleardone' || (command === 'clear' && message === 'done')){
        if (!flags.broadcaster){
            return ComfyJS.Say(`@${user} only the streamer can use this command!`);
        }
        
        for (k of Object.keys(tasks)){
            if (tasks[k].done){
                delete tasks[k];
            }
        }
        localStorage.setItem(`tasks`, JSON.stringify(tasks));
        updateTasks();
        return ComfyJS.Say(`@${user} cleared done!`);
    }
    
    else if (command === 'clear'){
        if (!flags.broadcaster){
            return ComfyJS.Say(`@${user} only the streamer can use this command!`);
        }

        localStorage.setItem(`tasks`, '{}');
        localStorage.setItem(`userData`, '{}');
        updateTasks();

        return ComfyJS.Say(`@${user} Cleared tasks!`);
    } 

    else if (commands[command]) {
        let reply = commands[command];
        reply = reply.replace('{user}', `@${user}`);
        ComfyJS.Say(reply);
    }
    
    else {
        return
    }
    updateTasks();
}

function updateTasks() {
    let list = "";
    let task_name;
    
    tasks = JSON.parse(localStorage.tasks);
    let no_of_tasks_completed = 0;
    let no_of_tasks = 0;

    for (t of Object.keys(tasks)){
        if (t.substr(t.length-5) === 'count') continue;
        if (t.substr(t.length-12) === 'pending_task') continue;

        task_name = tasks[t].task;

        if (tasks[t].done){
            list += `<div class="task-container">
            <input type="checkbox" checked="checked">
            <span class="checkmark"></span>
            <span class="username">${tasks[t].username}</span> : 
            ${task_name}
            </div>`;
            no_of_tasks_completed++;

        } else {
            list += `<div class="task-container">
            <input type="checkbox">
            <span class="checkmark"></span>
            <span class="username">${tasks[t].username}</span> : 
            ${task_name}
            </div>`;
        }
        no_of_tasks++;
    }
    completed_task_count.innerText = no_of_tasks_completed;
    task_count.innerText = no_of_tasks;
    taskList.innerHTML = list;
}

updateTasks();
