const tasksContainer = document.getElementById(`tasks_container`);
const txt = document.getElementById(`txt`);
const time = document.getElementById(`time`);
const date = document.getElementById(`date`);

getTasks().forEach(task => {
    createtaskElement(task.text, task.time, task.date, task.id);
});
 
currentDatime();    

if(!localStorage.getItem(`id`)){
    localStorage.setItem(`id`, `1`);
}

function currentDatime(){
    let today = new Date();
        document.getElementById("date").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        document.getElementById("time").value =  ('0' + today.getHours()).slice(-2) + ':' + ('0' + (today.getMinutes() )).slice(-2);      
    
}

function validForm(){
    event.preventDefault();
    const id = getId();

    if(txt.value === "" || validTime(time.value)  || date.value instanceof Date){
        return;
    } 

    addtask(txt.value, time.value, date.value, id.value);
    const txtinp = createtaskElement(txt.value, time.value, date.value, id.value);

    document.getElementById("form").reset();
    txtinp.focus();
    currentDatime();
}

function getTasks(){
    return JSON.parse(localStorage.getItem(`stickytasks-tasks`) || "[]")
}

function saveTasks(tasks){
    localStorage.setItem(`stickytasks-tasks`, JSON.stringify(tasks));
}
 
function createtaskElement(txt, time, date, new_id){
    const element = document.createElement(`section`);
    element.classList.add(`task`);
    element.id = new_id;
    const txtinp = document.createElement(`textarea`);
    txtinp.value = txt;
    const datinp = document.createElement(`input`);
    datinp.classList.add(`datimeinp`);
    datinp.value = date;
    datinp.type = `date`;
    const timinp = document.createElement(`input`);
    timinp.classList.add(`datimeinp`);
    timinp.type = `time`;
    timinp.value = time;
    const btn = document.createElement(`button`);
    btn.innerHTML = `<span class="glyphicon glyphicon-trash"></span></p>`;

    txtinp.addEventListener("change", () => {
        updateNote(new_id, txtinp.value, datinp.value, timinp.value);
    }); 
    datinp.addEventListener("change", () => {
        if(datinp.value instanceof Date){
            updateNote(new_id, txtinp.value, datinp.value, timinp.value);
        }
    }); 
    timinp.addEventListener("change", () => {
        if(validTime(timinp.value)){
        updateNote(new_id, txtinp.value, datinp.value, timinp.value);
        }
    }); 
    btn.addEventListener("click", () => {
        deleteTask(new_id);
    })

    document.getElementById(`notes_container`).appendChild(element);
    element.appendChild(txtinp);    
    element.appendChild(datinp);    
    element.appendChild(timinp);    
    element.appendChild(btn); 

    
    let i = 0;
    let interval = setInterval(function (){
        if(i >= 9){
            clearInterval(interval);
        }else{
            txtinp.style.color = `rgba(0, 0, 0, 0.${i})`;
            datinp.style.color = `rgba(0, 0, 0, 0.${i})`;
            timinp.style.color = `rgba(0, 0, 0, 0.${i})`;
            i++;
        }    
    }, 100)
    return txtinp;
}

function updateNote(id, newText, newDate, newTime){
    console.log("hi");
    const tasks = getTasks();
    const targetTask = tasks.filter(tasks => tasks.id == id)[0];

    targetTask.text = newText;
    targetTask.time = newTime;
    targetTask.date = newDate;
    saveTasks(tasks);
}

function addtask(txt, time2, date2, id2){

    let tasks = getTasks();
    let task = {
        text: txt,
        time: time2,
        date: date2,
        id: id2,
    }
    tasks.push(task);
    saveTasks(tasks);
}

function deleteTask(id){
    const doDelete = confirm("are you sure you wanna delete this assignment?");
    const element = document.getElementById(id);
    if(doDelete){
        const tasks = getTasks().filter(task => task.id != id);
        saveTasks(tasks);
        element.remove();
    }

}



function getId(){
    const current_id = Number(localStorage.getItem(`id`));
    const next_id = current_id + 1; 
    localStorage.setItem(`id`, next_id);
    return current_id;
}

function validTime(newTime){
    if(newTime == "" || newTime.indexOf(":")<0){
        return false;
    }
    else{
        let sHours = newTime.split(':')[0];
        let sMinutes = newTime.split(':')[1];
        
        if(sHours == "" || isNaN(sHours) || parseInt(sHours)>23){
            return false;
        }else if(parseInt(sHours) == 0)
        sHours = "00";

        else if (sHours <10)
            sHours = "0"+sHours;
    
        if(sMinutes == "" || isNaN(sMinutes) || parseInt(sMinutes)>59){
            return false;
        }else if(parseInt(sMinutes) == 0)
            sMinutes = "00";
        else if (sMinutes <10)
           sMinutes = "0"+sMinutes;

        newTime.value = sHours + ":" + sMinutes;        
    }
}

