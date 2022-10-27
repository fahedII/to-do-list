let input = document.getElementById('user-text'),
buttons = document.querySelectorAll('nav span:not(#clear-all)'),
parentTasks = document.getElementById('parent-tasks');


// Empty Array To Store The Tasks
let arrayOfTasks = [];

if(localStorage.getItem('task')){
    arrayOfTasks = JSON.parse(localStorage.getItem('task'))
}

getDataFromLocal();

// Two variables for edit title Task
let isEditTask = false;
let editId;

document.onkeyup = (e)=>{
    if(e.key === "Enter" && input.value != ''){
        if(!isEditTask){
            addTaskToArray(input.value); //Add Task To Array of Tasks
        }else{
            isEditTask = false;
            arrayOfTasks[editId].title = input.value;
            addElementsToPageFrom(arrayOfTasks);
            addDataToLocalStorage(arrayOfTasks);
        }
        input.value = ""; //Empty Input Field
    }
}

// Get Filter Elements
filterItems()

// Event for clear all Tasks from localStorage and page
document.querySelector('#clear-all').onclick = clearElment;


function addTaskToArray(taskText){
    // the id to new Element
    let id = 0; 
    // Task Data 
    const task = {
        id: id,
        title: taskText,
        completed: false,
        time: Date.now(),
    }

    // Push Task To Array of Tasks
    arrayOfTasks.push(task);

    // Add Tasks To Page
    addElementsToPageFrom(arrayOfTasks);

    // Add Tasks To LocalStorage
    addDataToLocalStorage(arrayOfTasks);
}

function addElementsToPageFrom(ofTasks){
    // Empty Tasks ul element
    parentTasks.innerHTML = "";

    // create Li element varibale
    let li = "";
    // Loping on Array of Tasks
    ofTasks.forEach((el, id)=>{
        el.id = id;
        let isCompleted = el.completed == true ? "checked" : "";
        li += `<li class="task" data-id='${el.id}'>
            <label for="${el.id}">
                <input ${isCompleted} onclick="upDateStatus(this)" type="checkbox" id="${el.id}"/>
                <p class="${isCompleted}" id='title'>${el.title}</p>
            </label>
            <div class="settings">
                <i class="fa-solid fa-ellipsis"></i>
                <ul class="settings-menu">
                    <li onclick='editTitle(this)' class="edit"><i class="edit fa-solid fa-pen"></i>Edit</li>
                    <li onclick="deleteTask(${el.id})"><i class="fa-solid fa-trash"></i>Deleted</li>
                </ul>
            </div>
        </li>`
    });
    parentTasks.innerHTML = li;
}

function addDataToLocalStorage(arry) {
    window.localStorage.setItem('task', JSON.stringify(arry))
}

function getDataFromLocal(){
    let data = window.localStorage.getItem('task');
    if(data){
        let tasks = JSON.parse(data);
        addElementsToPageFrom(tasks);
    }
}

function filterItems() {
    buttons.forEach((el)=>{
        el.addEventListener('click', ()=>{
            buttons.forEach((el)=> el.classList.remove('active'));
        });
    });

    buttons[0].addEventListener('click', ()=>{
        buttons[0].classList.add('active');
        addElementsToPageFrom(arrayOfTasks);
    })
    
    buttons[1].addEventListener('click', ()=>{
        buttons[1].classList.add('active');
        let fite = arrayOfTasks.filter((task)=> !task.completed)
        addElementsToPageFrom(fite)
    });

    buttons[2].addEventListener('click', ()=>{
        buttons[2].classList.add('active');
        let fite = arrayOfTasks.filter((task)=> task.completed)
        addElementsToPageFrom(fite)
    });
}

function clearElment (){
    // Remove AllItems from the page
    Array.from(parentTasks.children).forEach((el)=>el.remove());
    // Remove AllItems from the localStorage
    arrayOfTasks = [];
    addDataToLocalStorage(arrayOfTasks)
}

function upDateStatus(selectedTask){
    let taskName =  selectedTask.nextElementSibling;
    if(selectedTask.checked){
        // Edit to true in the localStorage
        arrayOfTasks[selectedTask.id].completed = true;
        taskName.classList.add('checked');
    }else{
        // Edit to False in the localStorage
        arrayOfTasks[selectedTask.id].completed = false;
        taskName.classList.remove('checked');
    }

    addDataToLocalStorage(arrayOfTasks);
}

function editTitle(element){
    // I can't writed tow parameters, there is Wrong in the javaScript code
    let taskId = element.parentElement.parentElement.parentElement.getAttribute('data-id');
    let taskName = element.parentElement.parentElement.parentElement.children[0].children[1].innerHTML
    editId = taskId;
    isEditTask = true;
    input.value = taskName;
}

function deleteTask(deleteId){
    // Remove a task from localStorage
    arrayOfTasks = arrayOfTasks.filter((task)=> task.id != deleteId);
    addDataToLocalStorage(arrayOfTasks);
    // Remove a task from Page
    Array.from(parentTasks.children).forEach((el)=> {
        if(el.getAttribute('data-id') == deleteId){
            el.remove()
        }
    })
}
